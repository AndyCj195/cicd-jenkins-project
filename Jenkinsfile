pipeline {
    // Definimos que el pipeline se puede ejecutar en cualquier agente disponible que cumpla los requisitos
    agent any

    tools {
        // Indica a Jenkins que autoinstale y cargue en el PATH la versión de Node.js configurada como 'NodeJS 20'
        nodejs 'NodeJS 20'
    }

    environment {
        // Variable para definir el nombre de nuestra imagen de Docker
        IMAGE_NAME = 'cicd-jenkins-app'
    }

    stages {
        // ETAPA 1: Checkout - Clonar el repositorio de código fuente
        stage('Checkout') {
            steps {
                echo 'Iniciando fase de descarga del repositorio...'
                // El comando 'checkout scm' indica a Jenkins que descargue el código fuente
                // utilizando la configuración de SCM (Git) especificada en la tarea del proyecto
                checkout scm
            }
        }

        // ETAPA 2: Install - Instalar las dependencias de Node.js de forma limpia
        stage('Install') {
            steps {
                echo 'Instalando dependencias del proyecto usando npm ci...'
                // 'npm ci' es ideal para pipelines ya que es determinista, borra node_modules previo
                // e instala exactamente las versiones especificadas en package-lock.json
                sh 'npm ci'
            }
        }

        // ETAPA 3: Test - Ejecutar pruebas y procesar el reporte de resultados
        stage('Test') {
            steps {
                echo 'Ejecutando suite de pruebas unitarias y de integración...'
                // Ejecuta Jest. La configuración de jest-junit generará el reporte 'junit.xml' en la raíz
                sh 'npm test'
            }
            post {
                always {
                    echo 'Publicando los resultados de las pruebas unitarias en Jenkins...'
                    // Utiliza el plugin nativo de Jenkins para escanear y visualizar el archivo junit.xml
                    junit 'junit.xml'
                }
            }
        }

        // ETAPA 4: Build - Construir la imagen Docker de producción
        stage('Build') {
            steps {
                echo "Construyendo la imagen Docker para la compilación #${env.BUILD_NUMBER}..."
                // Construye la imagen de producción asignándole el tag del build actual de Jenkins y 'latest'
                sh "docker build -t ${IMAGE_NAME}:${env.BUILD_NUMBER} -t ${IMAGE_NAME}:latest ."
            }
        }

        // ETAPA 5: Deploy - Desplegar la aplicación localmente usando Docker Compose
        stage('Deploy') {
            steps {
                echo 'Iniciando despliegue continuo de la aplicación con Docker Compose...'
                // Apaga cualquier contenedor previo para evitar conflictos y vuelve a levantar el servicio
                // en segundo plano utilizando la versión más reciente de la imagen construida
                sh 'docker compose down'
                sh 'docker compose up -d'
                echo 'Despliegue finalizado de forma correcta.'
            }
        }
    }

    // Acciones de cierre del pipeline para manejar notificaciones
    post {
        success {
            echo 'Enviando notificación de éxito a Slack...'
            // Envía un mensaje con borde verde al canal preconfigurado de Slack
            // Nota: Requiere la instalación del plugin "Slack Notification" en Jenkins
            // y la previa configuración del Integration Token en la sección de credenciales globales.
            slackSend(
                color: '#36a64f',
                message: "✅ ¡ÉXITO en el Pipeline de CI/CD!\nProyecto: *${env.JOB_NAME}*\nCompilación: *#${env.BUILD_NUMBER}*\nDetalles en: ${env.BUILD_URL}"
            )
        }
        failure {
            echo 'Enviando notificación de fallo a Slack...'
            // Envía un mensaje con borde rojo al canal de Slack para alertar al equipo de desarrollo
            slackSend(
                color: '#FF0000',
                message: "❌ ¡FALLO en el Pipeline de CI/CD!\nProyecto: *${env.JOB_NAME}*\nCompilación: *#${env.BUILD_NUMBER}*\nDetalles en: ${env.BUILD_URL}"
            )
        }
    }
}
