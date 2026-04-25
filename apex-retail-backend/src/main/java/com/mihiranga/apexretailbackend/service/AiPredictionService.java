package com.mihiranga.apexretailbackend.service;

import com.mihiranga.apexretailbackend.dto.AiPredictionRequest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service // Tells Spring Boot to load this class into memory at startup
public class AiPredictionService {

    // The URL where Python FastAPI microservice is listening
    private final String AI_API_URL = "http://localhost:8000/predict";
    private final RestTemplate restTemplate;

    public AiPredictionService() {
        this.restTemplate = new RestTemplate();
    }

    public double getPrediction(AiPredictionRequest request) {
        // Tell Python we are sending JSON data
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Package the headers and the DTO together
        HttpEntity<AiPredictionRequest> entity = new HttpEntity<>(request, headers);

        try {
            // Fire the POST request to the Python FastAPI microservice
            ResponseEntity<Map> response = restTemplate.postForEntity(AI_API_URL, entity, Map.class);

            // Extract the JSON response payload
            Map<String, Object> responseBody = response.getBody();

            // Look for the "predicted_weekly_sales" key and return its value
            if (responseBody != null && responseBody.containsKey("predicted_weekly_sales")) {
                // Cast to Number first to safely handle both Integers and Doubles
                Number prediction = (Number) responseBody.get("predicted_weekly_sales");
                return prediction.doubleValue();
            } else {
                throw new RuntimeException("Invalid response format from AI Microservice");
            }
        } catch (Exception e) {
            System.err.println("Error communicating with AI Microservice: " + e.getMessage());
            throw new RuntimeException("AI Microservice is unreachable or failed.");
        }
    }
}
