package com.kisanrakshak.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/farms")
@CrossOrigin(origins = "*")
public class FarmController {

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getFarmerFarms() {
        List<Map<String, Object>> farms = new ArrayList<>();
        Map<String, Object> f1 = new HashMap<>();
        f1.put("id", "farm-1");
        f1.put("name", "Shri Lakshmi Organic Farm");
        f1.put("district", "Kalaburagi");
        f1.put("taluk", "Kalaburagi");
        f1.put("village", "Sultanpur Village");
        f1.put("surveyNumber", "Sy. No. 142/2B");
        f1.put("areaAcres", 5.2);
        f1.put("soilType", "Black Soil");
        f1.put("irrigationType", "Borewell");
        f1.put("waterSource", "Deep Borewell (450 ft) + Krishi Honda");
        f1.put("riskScore", 38);
        f1.put("riskCategory", "MODERATE");
        farms.add(f1);
        return ResponseEntity.ok(farms);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createFarm(@RequestBody Map<String, Object> payload) {
        payload.put("id", "farm-" + System.currentTimeMillis());
        payload.put("riskScore", 30);
        payload.put("riskCategory", "MODERATE");
        return ResponseEntity.ok(payload);
    }
}
