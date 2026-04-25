package com.mihiranga.apexretailbackend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class AiPredictionRequest {

    @JsonProperty("Store")
    private int store;

    @JsonProperty("Dept")
    private int dept;

    @JsonProperty("Size")
    private int size;

    @JsonProperty("Temperature")
    private double temperature;

    @JsonProperty("Fuel_Price")
    private double fuelPrice;

    @JsonProperty("MarkDown1")
    private double markDown1;

    @JsonProperty("MarkDown2")
    private double markDown2;

    @JsonProperty("MarkDown3")
    private double markDown3;

    @JsonProperty("MarkDown4")
    private double markDown4;

    @JsonProperty("MarkDown5")
    private double markDown5;

    @JsonProperty("CPI")
    private double cpi;

    @JsonProperty("Unemployment")
    private double unemployment;

    @JsonProperty("Week")
    private int week;

    @JsonProperty("Year")
    private int year;

    @JsonProperty("Type_B")
    private boolean typeB;

    @JsonProperty("Type_C")
    private boolean typeC;
}
