# ---------- FRONTEND BUILD ----------
FROM node:22 AS frontend-build

WORKDIR /frontend

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY src ./src
COPY index.html ./
COPY *.json ./
COPY *.ts ./

RUN npm run build


# ---------- BACKEND BUILD ----------
FROM maven:3.9.9-eclipse-temurin-17 AS backend-build

WORKDIR /app

COPY backend/pom.xml .
COPY backend/src ./src

# Put React build inside Spring Boot static resources
COPY --from=frontend-build /frontend/dist ./src/main/resources/static

RUN mvn clean package -DskipTests


# ---------- FINAL IMAGE ----------
FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=backend-build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]