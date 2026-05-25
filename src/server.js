// Importar la aplicación Express configurada en app.js
const app = require('./app');

// Definir el puerto del servidor. 
// Primero intentará usar el puerto definido en la variable de entorno PORT (útil para producción y Docker),
// y si no está definido, por defecto utilizará el puerto 3000.
const PORT = process.env.PORT || 3000;

// Arrancar el servidor para escuchar peticiones entrantes
const server = app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(` Servidor Express ejecutándose en el puerto ${PORT}`);
    console.log(` Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`==================================================`);
});

// Manejar un cierre limpio de la aplicación ante señales de interrupción (sigterm/sigint)
const handleGracefulShutdown = () => {
    console.log('Cerrando servidor Express de forma controlada...');
    server.close(() => {
        console.log('Servidor HTTP cerrado.');
        process.exit(0);
    });
};

process.on('SIGTERM', handleGracefulShutdown);
process.on('SIGINT', handleGracefulShutdown);
