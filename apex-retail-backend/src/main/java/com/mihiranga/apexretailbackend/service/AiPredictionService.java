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

        // Manually map Java fields to the "Picky" Python keys
        Map<String, Object> pythonPayload = Map.ofEntries(
                Map.entry("Store", request.getStore()),
                Map.entry("Dept", request.getDept()),
                Map.entry("Size", request.getSize()),
                Map.entry("Temperature", request.getTemperature()),
                Map.entry("Fuel_Price", request.getFuelPrice()),
                Map.entry("CPI", request.getCpi()),
                Map.entry("Unemployment", request.getUnemployment()),
                Map.entry("Week", request.getWeek()),
                Map.entry("Year", request.getYear()),
                // Add the missing fields the model was trained on
                Map.entry("MarkDown1", 0.0),
                Map.entry("MarkDown2", 0.0),
                Map.entry("MarkDown3", 0.0),
                Map.entry("MarkDown4", 0.0),
                Map.entry("MarkDown5", 0.0),
                Map.entry("Type_B", false),
                Map.entry("Type_C", false)
        );

        // Wrap the MAP instead of the REQUEST DTO
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(pythonPayload, headers);

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
