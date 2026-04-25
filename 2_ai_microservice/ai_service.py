from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd

# Initialize the FastAPI app
app = FastAPI(title="Apex Retail AI Engine")

# Load the model and column structure into memory when server started
print("Loading Random Forest Model... Please Wait...")
try:
    model = joblib.load('apex_rf_model.joblib')
    model_columns = joblib.load('model_columns.joblib')
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")

# Define what the incoming data from spring boot should look like
class PredictionRequest(BaseModel):
    Store: int
    Dept: int
    Size: int
    Temperature: float
    Fuel_Price: float
    MarkDown1: float
    MarkDown2: float
    MarkDown3: float
    MarkDown4: float
    MarkDown5: float
    CPI: float
    Unemployment: float
    Week: int
    Year: int
    Type_B: bool
    Type_C: bool

# Create the POST endpoint
@app.post("/predict")
def predict_sales(request: PredictionRequest):
    print(f"DEBUG: Data reaching Python -> {request.dict()}")
    try:
        # Convert the incoming JSON request into a Pandas DataFrame
        input_data = pd.DataFrame([request.model_dump()])

        # Ensure the columns match exactly what the model was trained on
        input_data = input_data.reindex(columns=model_columns, fill_value=0)

        # Make the predictions
        prediction = model.predict(input_data)

        # Return the dollar amount
        return {"predicted_weekly_sales": float(prediction[0])}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))