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

    // A map of all 45 stores and their actual types
    private static final Map<Integer, String> STORE_TYPES = Map.ofEntries(
            Map.entry(1, "A"), Map.entry(2, "A"), Map.entry(3, "B"), Map.entry(4, "A"), Map.entry(5, "B"),
            Map.entry(6, "A"), Map.entry(7, "B"), Map.entry(8, "A"), Map.entry(9, "B"), Map.entry(10, "B"),
            Map.entry(11, "A"), Map.entry(12, "B"), Map.entry(13, "A"), Map.entry(14, "A"), Map.entry(15, "B"),
            Map.entry(16, "B"), Map.entry(17, "B"), Map.entry(18, "B"), Map.entry(19, "A"), Map.entry(20, "A"),
            Map.entry(21, "B"), Map.entry(22, "B"), Map.entry(23, "B"), Map.entry(24, "A"), Map.entry(25, "B"),
            Map.entry(26, "A"), Map.entry(27, "A"), Map.entry(28, "A"), Map.entry(29, "B"), Map.entry(30, "C"),
            Map.entry(31, "A"), Map.entry(32, "A"), Map.entry(33, "A"), Map.entry(34, "A"), Map.entry(35, "B"),
            Map.entry(36, "A"), Map.entry(37, "C"), Map.entry(38, "C"), Map.entry(39, "A"), Map.entry(40, "A"),
            Map.entry(41, "A"), Map.entry(42, "C"), Map.entry(43, "C"), Map.entry(44, "C"), Map.entry(45, "B")
    );

    public AiPredictionService() {
        this.restTemplate = new RestTemplate();
    }

    public double getPrediction(AiPredictionRequest request) {
        // Tell Python we are sending JSON data
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Look up the store type dynamically
        String storeType = STORE_TYPES.getOrDefault(request.getStore(), "A"); // Default to A if not found
        boolean isTypeB = storeType.equals("B");
        boolean isTypeC = storeType.equals("C");

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
                // MarkDowns default to 0
                Map.entry("MarkDown1", 0.0),
                Map.entry("MarkDown2", 0.0),
                Map.entry("MarkDown3", 0.0),
                Map.entry("MarkDown4", 0.0),
                Map.entry("MarkDown5", 0.0),

                // Dynamically set the correct Type booleans
                Map.entry("Type_B", isTypeB),
                Map.entry("Type_C", isTypeC)
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
