FROM openjdk:17-alpine

WORKDIR /

RUN apk --no-cache add curl

ENV NEXUS_USERNAME=admin
ENV NEXUS_PASSWORD=nexus
ENV NEXUS_URL=http://192.168.33.10:8081/repository/maven-releases/tn/esprit/myFirstProject/1.0/myFirstProject-1.0.jar

RUN curl -o app.jar  http://admin:nexus@192.168.33.10:8081/repository/maven-releases/tn/esprit/myFirstProject/1.0/myFirstProject-1.0.jar
EXPOSE 8089

ENTRYPOINT ["java", "-jar", "app.jar"]