// Importar el módulo Express
const express = require('express');

// Inicializar la aplicación Express
const app = express();

// Configurar middleware para parsear solicitudes JSON en el cuerpo (body)
app.use(express.json());

/**
 * @route GET /health
 * @desc Endpoint para verificar el estado de salud de la aplicación
 * @access Público
 */
app.get('/health', (req, res) => {
    // Retornar código de estado 200 con un JSON que indica que el servicio está funcionando
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

/**
 * @route GET /hello
 * @desc Endpoint de prueba simple que retorna un saludo de bienvenida
 * @access Público
 */
app.get('/hello', (req, res) => {
    // Retornar un saludo en formato JSON con código 200
    res.status(200).json({
        message: '¡Hola Mundo! Bienvenido al proyecto base de CI/CD.'
    });
});

/**
 * @route POST /sum
 * @desc Endpoint para sumar dos números recibidos en el cuerpo de la petición
 * @access Público
 */
app.post('/sum', (req, res) => {
    const { a, b } = req.body;

    // Validación 1: Verificar que ambos parámetros estén presentes en la petición
    if (a === undefined || b === undefined) {
        return res.status(400).json({
            error: 'Faltan parámetros requeridos. Debes proporcionar tanto "a" como "b" en el cuerpo de la petición.'
        });
    }

    // Validación 2: Verificar que ambos parámetros sean de tipo numérico y no valores vacíos o nulos
    const numA = Number(a);
    const numB = Number(b);

    if (isNaN(numA) || isNaN(numB)) {
        return res.status(400).json({
            error: 'Los parámetros "a" y "b" deben ser valores numéricos válidos.'
        });
    }

    // Calcular la suma y retornar el resultado con código de estado 200
    const sumResult = numA + numB;

    res.status(200).json({
        a: numA,
        b: numB,
        result: sumResult
    });
});

// Exportar la instancia de la aplicación Express
// Se exporta de forma separada del servidor (server.js) para facilitar las pruebas unitarias
module.exports = app;
