package com.kisanrakshak.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
public class DisasterAlertController {

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getActiveAlerts(@RequestParam(required = false) String district) {
        List<Map<String, Object>> alerts = new ArrayList<>();
        Map<String, Object> a1 = new HashMap<>();
        a1.put("id", "alt-kal-01");
        a1.put("title", "Heavy Rainfall & Waterlogging Warning");
        a1.put("severity", "WARNING");
        a1.put("disasterType", "HEAVY_RAIN");
        a1.put("districts", List.of("Kalaburagi", "Belagavi", "Vijayapura"));
        a1.put("farmImpact", "High waterlogging in black soils, root decay in flowering Tur, and localized flash runoff in low-lying bunds.");
        a1.put("recommendedActions", List.of(
            "Dig trench outlets at lower field boundaries immediately.",
            "Elevate all seed bags at least 30 cm onto wooden pallets.",
            "Disconnect open electrical starters at borewells."
        ));
        alerts.add(a1);
        return ResponseEntity.ok(alerts);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> broadcastAlert(@RequestBody Map<String, Object> alertPayload) {
        alertPayload.put("id", "alt-" + System.currentTimeMillis());
        alertPayload.put("issuedAt", new Date().toString());
        alertPayload.put("isActive", true);
        return ResponseEntity.ok(alertPayload);
    }
}
