pipeline {
    agent any
    tools{
        nodejs 'node'
    }
    options {
        skipDefaultCheckout(true)
    }
    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Copy Environment For Django API') {
            environment {
                API_ENV = credentials('CHATAPP_BACKEND_ENV')
            }

            steps {
            sh 'cp $API_ENV chat_app_backend/.env'
            }
        }

        stage('Deploy Back End Application') {
            steps {
                sh 'sudo docker compose -f docker-compose-prod.yml --env-file=chat_app_backend/.env up -d --build'
//                 sh 'sudo docker cp petoshield-api:/api/static /var/www/petoshield-data/static'
            }
        }

        stage('Clear Stopped Containers') {
            steps {
                sh 'sudo docker container prune -f'
            }
        }

        stage('Clear Unused Images') {
            steps {
                sh 'sudo docker rmi $(sudo docker images -f "dangling=true" -q) &>/dev/null'
            }
        }

        // DEPLOY REACT APPLICATION
        stage('Copy Environment For React Application') {
            environment {
                UI_ENV = credentials('CHATAPP_FRONTEND_ENV')
            }

            steps {
                sh 'cp $UI_ENV chat_app_frontend/.env'
            }
        }

        stage('Install React Application') {
            steps {
                sh 'cd chat_app_frontend && npm install'
            }
        }

        stage('Build React Application') {
            steps {
                sh 'cd chat_app_frontend && npm run build'
            }
        }

        stage("Clean Front End Folder") {
            steps {
               sh 'rm -rf /var/www/chat.vitaliisili.com'
            }
        }

        stage('Deploy Front End Application') {
            steps {
                sh 'mkdir -p /var/www/chat.vitaliisili.com'
                sh 'cp -r chat_app_frontend/build/. /var/www/chat.vitaliisili.com'
            }
        }
    }
}