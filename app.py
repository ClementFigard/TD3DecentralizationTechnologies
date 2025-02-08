from flask import Flask, render_template, request, jsonify
import numpy as np
import pandas as pd
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from xgboost import XGBClassifier  # Import XGBoost

app = Flask(__name__)

# Load the Iris dataset
def load_iris_data():
    iris = load_iris()
    df = pd.DataFrame(data=iris.data, columns=iris.feature_names)
    df['target'] = iris.target  # Add target column
    return df, iris.target_names

def train_xgboost():
    iris_data, iris_target_names = load_iris_data()
    X = iris_data.iloc[:, :-1].values  # Features
    y = iris_data.iloc[:, -1].values   # Labels

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

    xgb_model = XGBClassifier(use_label_encoder=False, eval_metric='mlogloss')  # XGBoost Classifier
    xgb_model.fit(X_train, y_train)

    y_pred = xgb_model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"XGBoost Model Accuracy: {accuracy:.2f}")

    return xgb_model, iris_target_names, accuracy

# Train model and get accuracy
xgb_model, iris_target_names, xgb_accuracy = train_xgboost()

@app.route('/')
def home():
    """ Renders the prediction form page with model accuracy """
    return render_template("predict.html", accuracy=xgb_accuracy)

@app.route('/handle_get', methods=['GET'])
def handle_get():
    """ Handles GET request for flower prediction (Returns JSON) """
    try:
        sepal_length = float(request.args.get('sepal_length'))
        sepal_width = float(request.args.get('sepal_width'))
        petal_length = float(request.args.get('petal_length'))
        petal_width = float(request.args.get('petal_width'))

        # Predict the flower
        user_input = np.array([[sepal_length, sepal_width, petal_length, petal_width]])
        predicted_class = xgb_model.predict(user_input)[0]
        predicted_species = iris_target_names[predicted_class]

        # Return response as JSON
        return jsonify({"response": predicted_species})

    except Exception:
        return jsonify({"response": "Error: Invalid input"}), 400

@app.route('/handle_post', methods=['POST'])
def handle_post():
    """ Handles POST request for flower prediction (Returns JSON) """
    try:
        sepal_length = float(request.form['sepal_length'])
        sepal_width = float(request.form['sepal_width'])
        petal_length = float(request.form['petal_length'])
        petal_width = float(request.form['petal_width'])

        # Predict the flower
        user_input = np.array([[sepal_length, sepal_width, petal_length, petal_width]])
        predicted_class = xgb_model.predict(user_input)[0]
        predicted_species = iris_target_names[predicted_class]

        # Return response as JSON
        return jsonify({"response": predicted_species})

    except Exception:
        return jsonify({"response": "Error: Invalid input"}), 400

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)