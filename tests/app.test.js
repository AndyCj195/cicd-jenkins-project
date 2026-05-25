// Importar Supertest para realizar peticiones HTTP simuladas sin levantar el servidor físicamente
const request = require('supertest');

// Importar la aplicación Express configurada (sin arrancar la escucha del puerto)
const app = require('../src/app');

describe('Pruebas de la API de Express (Jest + Supertest)', () => {
    
    // --- Pruebas para GET /health ---
    describe('GET /health', () => {
        test('Debería retornar un código de estado 200 y el estado de la aplicación como "UP"', async () => {
            const response = await request(app).get('/health');
            
            // Verificar código HTTP
            expect(response.statusCode).toBe(200);
            
            // Verificar tipo de contenido
            expect(response.headers['content-type']).toMatch(/json/);
            
            // Verificar estructura del cuerpo
            expect(response.body).toHaveProperty('status');
            expect(response.body.status).toBe('UP');
            expect(response.body).toHaveProperty('timestamp');
            expect(response.body).toHaveProperty('uptime');
        });
    });

    // --- Pruebas para GET /hello ---
    describe('GET /hello', () => {
        test('Debería retornar un código de estado 200 y el mensaje de bienvenida esperado', async () => {
            const response = await request(app).get('/hello');
            
            // Verificar código HTTP
            expect(response.statusCode).toBe(200);
            
            // Verificar cuerpo de respuesta
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('¡Hola Mundo!');
        });
    });

    // --- Pruebas para POST /sum ---
    describe('POST /sum', () => {
        test('Debería retornar la suma correcta de dos números enteros positivos (a = 5, b = 10)', async () => {
            const response = await request(app)
                .post('/sum')
                .send({ a: 5, b: 10 });
            
            // Verificar respuesta exitosa
            expect(response.statusCode).toBe(200);
            
            // Verificar que el cálculo sea correcto
            expect(response.body.result).toBe(15);
            expect(response.body.a).toBe(5);
            expect(response.body.b).toBe(10);
        });

        test('Debería procesar y sumar números negativos y decimales (a = -2.5, b = 7.3)', async () => {
            const response = await request(app)
                .post('/sum')
                .send({ a: -2.5, b: 7.3 });
            
            // Verificar código HTTP
            expect(response.statusCode).toBe(200);
            
            // Verificar resultado exacto (utilizamos toBeCloseTo para problemas de redondeo float)
            expect(response.body.result).toBeCloseTo(4.8);
            expect(response.body.a).toBe(-2.5);
            expect(response.body.b).toBe(7.3);
        });

        test('Debería retornar un código 400 Bad Request si falta uno de los parámetros ("a" o "b")', async () => {
            const response = await request(app)
                .post('/sum')
                .send({ a: 10 }); // Falta 'b'
            
            // Verificar que retorne error de cliente
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toContain('Faltan parámetros requeridos');
        });

        test('Debería retornar un código 400 Bad Request si los parámetros no son números válidos', async () => {
            const response = await request(app)
                .post('/sum')
                .send({ a: "diez", b: 20 }); // 'a' no es un número
            
            // Verificar que retorne error de cliente
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toContain('deben ser valores numéricos válidos');
        });
    });
});
