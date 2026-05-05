pipeline {
    agent any

    environment {
        NODE_VERSION = '20'
        DOCKER_REGISTRY = credentials('docker-registry-url')
        DOCKER_CREDENTIALS = credentials('docker-credentials')
        STAGING_HOST = credentials('staging-host')
        STAGING_USER = credentials('staging-user')
        STAGING_KEY = credentials('staging-ssh-key')
    }

    options {
        timeout(time: 1, unit: 'HOURS')
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10', daysToKeepStr: '30'))
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.COMMIT_SHA = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    env.BRANCH_NAME = sh(script: 'git rev-parse --abbrev-ref HEAD', returnStdout: true).trim()
                    echo "Building commit ${COMMIT_SHA} on branch ${BRANCH_NAME}"
                }
            }
        }

        stage('Setup') {
            steps {
                script {
                    sh '''
                        node --version
                        npm --version
                        docker --version
                        docker compose --version
                    '''
                }
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Backend API') {
                    steps {
                        dir('backend/api') {
                            sh 'npm ci'
                        }
                    }
                }
                stage('Backend Workers') {
                    steps {
                        dir('backend/workers') {
                            sh 'npm ci'
                        }
                    }
                }
                stage('Frontend') {
                    steps {
                        dir('frontend') {
                            sh 'npm ci'
                        }
                    }
                }
            }
        }

        stage('Lint & Test') {
            parallel {
                stage('API Tests') {
                    steps {
                        dir('backend/api') {
                            sh 'npm test -- --coverage --passWithNoTests'
                            publishHTML target: [
                                reportDir: 'coverage',
                                reportFiles: 'index.html',
                                reportName: 'API Coverage Report'
                            ]
                        }
                    }
                }
                stage('Workers Tests') {
                    steps {
                        dir('backend/workers') {
                            sh 'npm test -- --coverage --passWithNoTests'
                            publishHTML target: [
                                reportDir: 'coverage',
                                reportFiles: 'index.html',
                                reportName: 'Workers Coverage Report'
                            ]
                        }
                    }
                }
                stage('Frontend Tests') {
                    steps {
                        dir('frontend') {
                            sh 'npm test -- --coverage --passWithNoTests'
                            publishHTML target: [
                                reportDir: 'coverage',
                                reportFiles: 'index.html',
                                reportName: 'Frontend Coverage Report'
                            ]
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            when {
                anyOf {
                    branch 'master'
                    branch 'develop'
                    changeRequest()
                }
            }
            steps {
                script {
                    sh '''
                        echo "Building Docker images for commit ${COMMIT_SHA}..."
                        docker compose build
                    '''
                }
            }
        }

        stage('Security Scan') {
            when {
                anyOf {
                    branch 'master'
                    changeRequest()
                }
            }
            steps {
                script {
                    sh '''
                        echo "Running security checks..."
                        # Run dependency checks
                        npm audit --audit-level=moderate || true
                    '''
                }
            }
        }

        stage('Deploy to Staging') {
            when {
                allOf {
                    branch 'master'
                    expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
                }
            }
            steps {
                script {
                    sh '''
                        echo "Deploying to staging environment..."
                        # Tag Docker images
                        docker tag news_summarizer-backend:latest ${DOCKER_REGISTRY}/news_summarizer-backend:${COMMIT_SHA}
                        docker tag news_summarizer-backend:latest ${DOCKER_REGISTRY}/news_summarizer-backend:latest
                        docker tag news_summarizer-frontend:latest ${DOCKER_REGISTRY}/news_summarizer-frontend:${COMMIT_SHA}
                        docker tag news_summarizer-frontend:latest ${DOCKER_REGISTRY}/news_summarizer-frontend:latest
                        
                        # Execute deployment script
                        chmod +x scripts/deploy_staging.sh
                        ./scripts/deploy_staging.sh
                    '''
                }
            }
        }
    }

    post {
        always {
            cleanWs()
            script {
                sh '''
                    echo "Cleaning up Docker resources..."
                    docker system prune -f || true
                '''
            }
        }

        success {
            script {
                if (env.BRANCH_NAME == 'master') {
                    emailext(
                        subject: "Build SUCCESS: News Summarizer ${COMMIT_SHA}",
                        body: "Build #${BUILD_NUMBER} completed successfully on master branch.",
                        to: '${DEFAULT_RECIPIENTS}'
                    )
                }
            }
        }

        failure {
            script {
                emailext(
                    subject: "Build FAILED: News Summarizer ${COMMIT_SHA}",
                    body: "Build #${BUILD_NUMBER} failed. Check Jenkins logs for details.",
                    to: '${DEFAULT_RECIPIENTS}'
                )
            }
        }

        unstable {
            script {
                echo "Build is unstable. Review test results."
            }
        }
    }
}
