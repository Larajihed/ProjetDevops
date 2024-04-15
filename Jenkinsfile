pipeline {
    agent any

    tools {
        maven 'M2_HOME' // Cela correspond au nom configuré dans Jenkins pour Maven
        jdk 'JAVA_HOME' // Cela correspond au nom configuré dans Jenkins pour JDK
        nodejs 'nodeJs'
    }
    
    environment { 
        dockerImage = ''
    }
    

    stages {
        stage('Start Services (Sonarqube&Nexus&MySQL)') {
            steps {
                script {
                    // Définition des services à démarrer
                    def services = ['sonarqube', 'nexus', 'mysql-container']
        
                    // Boucle sur chaque service pour vérifier et démarrer si nécessaire
                    services.each { service ->
                        // Vérifier si le conteneur est déjà en cours d'exécution
                        def isRunning = sh(script: "docker ps -q --filter name=${service}", returnStdout: true).trim()
                        
                        // Si le conteneur n'est pas en cours d'exécution, le démarrer
                        if (isRunning == '') {
                            sh "docker start ${service}"
                            echo "${service} has been started."
                        } else {
                            echo "${service} is already running."
                        }
                    }
                }
            }
        }

        stage('Git Checkout') {
            steps {
                git branch: 'University_Management_MondherArfaoui', credentialsId: '62b22b58-a22f-49f1-822c-f3141c635c2d', url: 'https://github.com/SpawN005/DevOps.git'
            }
        }
        
        stage('Compile Backend') {
            steps {
                dir('myFirstProject') {
                    sh 'mvn clean compile'
                }
            }
        }
        
        stage('Test(JUnit&Mockito&Jacoco) Backend') {
            steps {
                dir('myFirstProject') {
                    // Utilise Maven pour nettoyer, compiler et exécuter les tests
                    sh 'mvn clean test jacoco:report'
                }
            }
            post {
                success {
                    junit '**/target/surefire-reports/*.xml'
                }
            }
        }

        stage('SonarQube Analysis Backend') {
            steps {
                dir('myFirstProject') {
                    // Utilise Maven pour lancer l'analyse SonarQube
                    sh 'mvn sonar:sonar -Dsonar.projectKey=devOps -Dsonar.host.url=http://192.168.33.10:9000 -Dsonar.login=squ_2c4e8049f346c18b168f8ac95d473d9379c2bf9f'
                }
            }
        }
        
        stage('OWASP Dependency-Check Backend') {
            steps {
                dir('myFirstProject') {
                    dependencyCheck additionalArguments: '--scan ./', odcInstallation: 'DP'
                    dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
                }
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('myFirstProject') {
                    sh 'mvn clean install'
                }
            }
            post {
                success {
                    archiveArtifacts artifacts: '**/target/*.jar', fingerprint: true
                }
            }
        }

        stage('Deploy To Nexus Backend') {
            steps {
                dir('myFirstProject') {
                    withMaven(globalMavenSettingsConfig: '6d5902aa-449f-4789-97a3-6efd4dea2b71', jdk: 'JAVA_HOME', maven: 'M2_HOME', mavenSettingsConfig: '', traceability: true) {
                        sh 'mvn deploy'
                    }
                }
            }
        }
        
        stage('Docker Image Backend') {
            steps {
                dir('myFirstProject') {
                    script {
                        dockerImage = docker.build "mondherar/springboot:latest" 
                    }
                }
            }
        }

        stage('Docker Hub Backend') {
            steps {
                dir('myFirstProject') {
                    script {
                        docker.withRegistry( '', 'docker' ) { 
                            dockerImage.push() 
                        }
                    }
                }
            }
        }
        
        stage('Node Install Frontend') {
            steps {
                   dir('Angular_Gestion_Foyer') {  sh 'npm install -f'}
              
            }
        }
        
       stage('Node Clean Frontend') {
            steps {
                dir('Angular_Gestion_Foyer') {
                sh 'npm cache clean --force'}
            } 
       }
  
      
        stage('Docker Image Frontend') {
            steps {
                  dir('Angular_Gestion_Foyer') {
                script {
                    dockerImage = docker.build "mondherar/angular:latest" 
                }
                  }
            }
        }
        
        stage('Docker Hub Frontend') {
            steps {
                 dir('Angular_Gestion_Foyer') {
                script {
                    docker.withRegistry( '', 'docker' ) { 
                        dockerImage.push() 
                    }
                } }
            }
        }

        stage('Docker Compose') {
            steps {
                sh 'docker compose up -d'
            }
        }
        
        stage('Start Prometheus') {
            steps {
                script {
                    // Vérifier si le conteneur Prometheus est déjà en cours d'exécution
                    def isPrometheusRunning = sh(script: "docker ps -q --filter name=prometheus", returnStdout: true).trim()
                    // Si le conteneur n'est pas en cours d'exécution, le démarrer
                    if (isPrometheusRunning == '') {
                        sh 'docker start prometheus'
                    } else {
                        echo 'Prometheus is already running.'
                    }
                }
            }
        }
        
        stage('Start Grafana') {
            steps {
                script {
                    // Vérifier si le conteneur Grafana est déjà en cours d'exécution
                    def isGrafanaRunning = sh(script: "docker ps -q --filter name=grafana", returnStdout: true).trim()
                    // Si le conteneur n'est pas en cours d'exécution, le démarrer
                    if (isGrafanaRunning == '') {
                        sh 'docker start grafana'
                    } else {
                        echo 'Grafana is already running.'
                    }
                }
            }
        }
        
        stage('Send Email Notification') {
            steps {
                script {
                    if (currentBuild.result == 'SUCCESS') {
                        emailext (
                            to: 'mondher.arfaoui@esprit.tn',
                            subject: "SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                            mimeType: 'text/html', // Spécifie le type MIME comme HTML
                            body: """<html>
                                        <body>
                                            <p style="color: green; font-weight: bold;">Félicitations !</p>
                                            <p>Le build <b>${env.JOB_NAME} #${env.BUILD_NUMBER}</b> a réussi.</p>
                                            <p>Consulter les détails ici : <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                                        </body>
                                    </html>"""
                        )
                    } else {
                        emailext (
                            to: 'mondher.arfaoui@esprit.tn',
                            subject: "FAILURE: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                            mimeType: 'text/html',
                            body: """<html>
                                        <body>
                                            <p style="color: red; font-weight: bold;">Alerte de Build Échoué !</p>
                                            <p>Le build <b>${env.JOB_NAME} #${env.BUILD_NUMBER}</b> a échoué.</p>
                                            <p>Consulter les détails et les logs ici : <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                                        </body>
                                    </html>"""
                        )
                    }
                }
            }
        }
    }

    
    post {
        always {
            echo 'Build completed'
            cleanWs()
        }
    }
}
