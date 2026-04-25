package com.mihiranga.apexretailbackend.controller;

import com.mihiranga.apexretailbackend.dto.AiPredictionRequest;
import com.mihiranga.apexretailbackend.service.AiPredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/v1/predictions") // Base URL for all prediction-related endpoints
@CrossOrigin(origins = "*") // Allows frontend to make requests to this API from any origin
public class PredictionController {

    private final AiPredictionService aiPredictionService;

    @Autowired
    public PredictionController(AiPredictionService aiPredictionService) {
        this.aiPredictionService = aiPredictionService;
    }

    @PostMapping("/forecast")
    public ResponseEntity<Map<String, Object>> getForecast(@RequestBody AiPredictionRequest request) {
        try {
            // Send the incoming frontend data to the Service
            double predictedSales = aiPredictionService.getPrediction(request);

            // Package the result nicely for the frontend
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("predictedSales", predictedSales);
            response.put("message", "Prediction generated successfully by AI engine.");

            // Return a 200 OK with the data
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // If anything fails (like Python being offline), return a 500 error safely
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}
