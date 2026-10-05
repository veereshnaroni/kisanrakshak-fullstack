package com.kisanrakshak.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/loss-reports")
@CrossOrigin(origins = "*")
public class LossReportController {

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getReports() {
        List<Map<String, Object>> reports = new ArrayList<>();
        Map<String, Object> r1 = new HashMap<>();
        r1.put("id", "rep-2026-081");
        r1.put("farmerName", "Ramesh Kumar");
        r1.put("disasterType", "Flash Flood & Waterlogging");
        r1.put("affectedResource", "Crops");
        r1.put("estimatedLossInr", 45000);
        r1.put("status", "VERIFIED");
        r1.put("compensationSanctionedInr", 18500);
        reports.add(r1);
        return ResponseEntity.ok(reports);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> submitReport(@RequestBody Map<String, Object> payload) {
        String reportId = "rep-" + Calendar.getInstance().get(Calendar.YEAR) + "-" + (100 + new Random().nextInt(900));
        payload.put("id", reportId);
        payload.put("status", "SUBMITTED");
        payload.put("reportedAt", new Date().toString());
        return ResponseEntity.ok(payload);
    }
}
