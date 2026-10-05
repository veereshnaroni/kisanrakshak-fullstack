package com.kisanrakshak;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class KisanRakshakApplication {
    public static void main(String[] args) {
        SpringApplication.run(KisanRakshakApplication.class, args);
        System.out.println("==========================================================");
        System.out.println(" KisanRakshak Karnataka Spring Boot Engine (Port: 8080)   ");
        System.out.println(" Disaster-Resilient Agriculture Platform Initialized      ");
        System.out.println(" Swagger API Docs: http://localhost:8080/swagger-ui.html  ");
        System.out.println("==========================================================");
    }
}
