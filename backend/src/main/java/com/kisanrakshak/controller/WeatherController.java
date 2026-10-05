package com.kisanrakshak.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = "*")
public class WeatherController {

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentWeather(
            @RequestParam(defaultValue = "17.3297") double lat,
            @RequestParam(defaultValue = "76.8343") double lon,
            @RequestParam(defaultValue = "Kalaburagi") String district,
            @RequestParam(defaultValue = "Kalaburagi") String taluk) {

        String openMeteoUrl = String.format(
            "https://api.open-meteo.com/v1/forecast?latitude=%f&longitude=%f&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=Asia%%2FKolkata",
            lat, lon
        );

        try {
            Map<?, ?> result = restTemplate.getForObject(openMeteoUrl, Map.class);
            return ResponseEntity.ok(result);
        } catch (Exception ex) {
            // Fallback response if external API is temporarily unreachable
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("district", district);
            fallback.put("taluk", taluk);
            fallback.put("temperature", 28);
            fallback.put("humidity", 76);
            fallback.put("rainProbability", 72);
            fallback.put("condition", "Partly Cloudy with High Rainfall Probability");
            fallback.put("fallback", true);
            return ResponseEntity.ok(fallback);
        }
    }
}
