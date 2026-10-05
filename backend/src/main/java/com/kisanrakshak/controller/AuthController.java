package com.kisanrakshak.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> loginRequest) {
        String identifier = loginRequest.get("identifier");
        String password = loginRequest.get("password");

        // Demo JWT & Authentication Response
        Map<String, Object> response = new HashMap<>();
        response.put("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.kisanrakshak.mock.jwt.token");
        response.put("type", "Bearer");
        response.put("identifier", identifier);
        
        if ("9448099887".equals(identifier)) {
            response.put("role", "ROLE_ADMIN");
            response.put("name", "Dr. Siddharamaiah M.");
        } else {
            response.put("role", "ROLE_FARMER");
            response.put("name", "Ramesh Kumar");
            response.put("district", "Kalaburagi");
            response.put("taluk", "Kalaburagi");
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerFarmer(@RequestBody Map<String, Object> registerRequest) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Farmer profile registered successfully in Karnataka database.");
        response.put("kisanId", "KA-KLB-" + System.currentTimeMillis() % 10000);
        return ResponseEntity.ok(response);
    }
}
