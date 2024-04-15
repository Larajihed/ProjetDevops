FROM openjdk:17-alpine

WORKDIR /

RUN apk --no-cache add curl

ENV NEXUS_USERNAME=admin
ENV NEXUS_PASSWORD=nexus
ENV NEXUS_URL=http://192.168.33.10:8081/repository/maven-releases/tn/esprit/myFirstProject/1.0/myFirstProject-1.0.jar
ENV SPRINGPROFILES=prod

RUN curl -o app.jar  http://admin:nexus@192.168.33.10:8081/repository/maven-releases/tn/esprit/myFirstProject/1.0/myFirstProject-1.0.jar
EXPOSE 8089

ENTRYPOINT ["java", "-jar", "app.jar","-Dspring.profiles.active=${SPRINGPROFILES}","-jar", "-Dserver.port=8089", "-Dserver.address=0.0.0.0"]