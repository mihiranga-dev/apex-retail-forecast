package com.mihiranga.apexretailbackend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class AiPredictionRequest {

    @JsonProperty("store")
    private int store;

    @JsonProperty("dept")
    private int dept;

    @JsonProperty("size")
    private int size;

    @JsonProperty("temperature")
    private double temperature;

    @JsonProperty("fuelPrice")
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

    @JsonProperty("cpi")
    private double cpi;

    @JsonProperty("unemployment")
    private double unemployment;

    @JsonProperty("week")
    private int week;

    @JsonProperty("year")
    private int year;

    @JsonProperty("Type_B")
    private boolean typeB;

    @JsonProperty("Type_C")
    private boolean typeC;
}
