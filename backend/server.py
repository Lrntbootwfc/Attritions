import pandas as pd
import numpy as np
from flask import Flask, jsonify
from flask_cors import CORS
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
import random

# --- Flask App Setup ---
app = Flask(__name__)
# Enable CORS for the React frontend running on another port (e.g., 3000 or 5173)
CORS(app)

# --- Data Simulation & Preprocessing ---

# 1. Simulate a large, synthetic employee dataset
def create_synthetic_data(n_employees=2000):
    np.random.seed(42)
    data = {
        'EmployeeID': range(1, n_employees + 1),
        'Age': np.random.randint(22, 60, n_employees),
        'Department': np.random.choice(['Sales', 'Research & Dev', 'HR', 'Finance', 'IT', 'Marketing'], n_employees, p=[0.3, 0.4, 0.1, 0.05, 0.1, 0.05]),
        'JobSatisfaction': np.random.randint(1, 5, n_employees), # 1=Low, 4=High
        'PerformanceRating': np.random.randint(1, 4, n_employees), # 1=Low, 3=High
        'MonthlyIncome': np.random.randint(30000, 150000, n_employees),
        'YearsAtCompany': np.random.randint(0, 20, n_employees),
        'EnvironmentSatisfaction': np.random.randint(1, 5, n_employees),
        # Target Variable: Attrition (1=Yes, 0=No). Create bias: Low satisfaction/rating leads to higher attrition.
        'Attrition': np.where(
            (np.random.rand(n_employees) < 0.1) | # 10% base attrition
            ((np.random.randint(1, 5, n_employees) < 2) & (np.random.rand(n_employees) < 0.4)), # High attrition risk for low satisfaction
            1, 0
        ),
        'LastPromotionYears': np.random.randint(0, 5, n_employees),
        'ExitReason': np.random.choice(
            ['Career Growth', 'Compensation', 'Work-Life Balance', 'Manager Issues', 'Other'],
            n_employees,
            p=[0.35, 0.3, 0.2, 0.1, 0.05]
        )
    }
    df = pd.DataFrame(data)
    # Only assign an exit reason if attrition is 1
    df.loc[df['Attrition'] == 0, 'ExitReason'] = np.nan
    return df

df = create_synthetic_data()
attrited_employees = df[df['Attrition'] == 1].copy()

# --- Machine Learning Model (Logistic Regression) ---
# Goal: Predict the probability of attrition based on current employee data.

def train_attrition_model(data):
    features = ['Age', 'JobSatisfaction', 'PerformanceRating', 'MonthlyIncome', 'YearsAtCompany', 'EnvironmentSatisfaction']
    
    # Preprocessing: One-hot encode Department (though not used in this simplified model for stability)
    X = data[features]
    y = data['Attrition']

    # Train-Test Split (Standard practice, though we train on all data here for simplicity in a demo)
    # X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Initialize and train the Logistic Regression Model
    model = LogisticRegression(solver='liblinear', random_state=42)
    model.fit(X, y)
    return model

attrition_model = train_attrition_model(df)
features = ['Age', 'JobSatisfaction', 'PerformanceRating', 'MonthlyIncome', 'YearsAtCompany', 'EnvironmentSatisfaction']

def predict_high_risk_employees(model, data, threshold=0.8):
    # Predict the probability of attrition (P=1)
    probabilities = model.predict_proba(data[features])[:, 1]
    data['AttritionProbability'] = probabilities
    
    # Identify employees above the risk threshold
    high_risk = data[(data['AttritionProbability'] >= threshold) & (data['Attrition'] == 0)]
    
    # Select key fields for the dashboard display
    return high_risk[['EmployeeID', 'Department', 'JobSatisfaction', 'PerformanceRating', 'AttritionProbability']].sort_values(by='AttritionProbability', ascending=False).head(10)


# --- API Endpoints ---

@app.route('/api/trends', methods=['GET'])
def get_attrition_trends():
    """Provides simulated monthly attrition trends for visualization."""
    # Simulate 12 months of data
    months = pd.date_range(end=pd.Timestamp.now(), periods=12, freq='M').strftime('%Y-%m')
    
    # Create slightly fluctuating attrition rates (around 1.5% to 3.5%)
    # Use a smooth trend with random noise
    base_rate = np.linspace(2.0, 3.0, 12) / 100
    noise = np.random.uniform(-0.005, 0.005, 12)
    rates = (base_rate + noise) * 100
    
    # Format for charting
    trends = [{'month': m, 'attrition_rate': round(r, 2)} for m, r in zip(months, rates)]
    
    # Calculate overall summary metrics
    total_employees = len(df)
    total_attrition = len(attrited_employees)
    overall_rate = round((total_attrition / total_employees) * 100, 2)
    
    return jsonify({
        'trends': trends,
        'summary': {
            'total_employees': total_employees,
            'total_attrition_ytd': total_attrition,
            'overall_attrition_rate': overall_rate
        }
    })

@app.route('/api/departments', methods=['GET'])
def get_department_analysis():
    """Provides department-wise resignation counts and rates."""
    
    # Total employees by department
    total_by_dept = df['Department'].value_counts().reset_index()
    total_by_dept.columns = ['Department', 'TotalEmployees']
    
    # Attrition counts by department
    attrition_by_dept = attrited_employees['Department'].value_counts().reset_index()
    attrition_by_dept.columns = ['Department', 'Resignations']
    
    # Merge and calculate rate
    dept_analysis = pd.merge(total_by_dept, attrition_by_dept, on='Department', how='left').fillna(0)
    dept_analysis['Resignations'] = dept_analysis['Resignations'].astype(int)
    dept_analysis['AttritionRate'] = round((dept_analysis['Resignations'] / dept_analysis['TotalEmployees']) * 100, 2)
    
    # Convert to JSON format
    return jsonify(dept_analysis.to_dict('records'))

@app.route('/api/insights', methods=['GET'])
def get_exit_survey_insights():
    """Analyzes simulated exit survey reasons."""
    
    # Count the frequency of each reason among attrited employees
    reason_counts = attrited_employees['ExitReason'].value_counts().reset_index()
    reason_counts.columns = ['Reason', 'Count']
    
    # Calculate percentage
    total_resignations = len(attrited_employees)
    reason_counts['Percentage'] = round((reason_counts['Count'] / total_resignations) * 100, 1)
    
    # Find the top reason
    top_reason = reason_counts.iloc[0]['Reason'] if not reason_counts.empty else 'N/A'
    
    return jsonify({
        'reasons': reason_counts.to_dict('records'),
        'top_reason': top_reason
    })

@app.route('/api/predictions', methods=['GET'])
def get_high_risk_predictions():
    """Uses the ML model to predict and list high-risk employees."""
    
    high_risk_df = predict_high_risk_employees(attrition_model, df, threshold=0.7) # Slightly lower threshold for a demo
    
    # Map numerical satisfaction/rating to labels for better UI display
    satisfaction_map = {1: 'Low', 2: 'Medium', 3: 'High', 4: 'Very High'}
    rating_map = {1: 'Poor', 2: 'Good', 3: 'Excellent'}

    high_risk_list = high_risk_df.copy()
    high_risk_list['JobSatisfaction'] = high_risk_list['JobSatisfaction'].map(satisfaction_map)
    high_risk_list['PerformanceRating'] = high_risk_list['PerformanceRating'].map(rating_map)
    high_risk_list['AttritionProbability'] = (high_risk_list['AttritionProbability'] * 100).round(1).astype(str) + '%'
    
    return jsonify(high_risk_list.to_dict('records'))

# --- Main Run Block ---
if __name__ == '__main__':
    print("Starting Flask server...")
    print("Data simulated and ML model trained successfully.")
    # Run on a non-default port to avoid conflict and allow React to run easily
    app.run(debug=True, port=5000)
