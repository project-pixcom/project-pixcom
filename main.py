from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
import base64
import os
from google.cloud import dialogflow_v2 as dialogflow_v2
import uuid
import json
from bson import ObjectId
from datetime import datetime

credentials = os.environ['credential']
file_name = "cred.json"
my_dict = json.loads(credentials)

# Write the dictionary to the file
with open(file_name, 'w') as json_file:
  json.dump(my_dict, json_file)
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = file_name
app = Flask(__name__)
link = os.getenv('mongodb_link')
client = MongoClient(link)
db = client['project-pixcom']  # Replace with your database name
collection = db['appointments']


@app.route('/')
def serve_image():

  return render_template('index.html')


@app.route('/get_records', methods=['POST'])
def serve_ev_content():
  data = request.get_json()
  text_data = data.get('text')
  print("hello from ", text_data)
  documents = collection.find({'date': text_data})
  contents = []
  for document in documents:
    date = document['date']
    model = document['model']
    name = document['name']
    id = document['_id']
    contents.append({'date': date, 'model': model, 'name': name, 'id': id})
  print("contents", contents)
  return render_template('event_content.html', contents=contents)


@app.route('/edit', methods=['POST'])
def serve_content():
  data = request.get_json()
  text_data = data.get('text')
  print("hello from ", type(text_data))
  try:
    # Convert the string to ObjectId
    object_id = ObjectId(text_data)

    # Find document by _id
    result = collection.find_one({'_id': object_id})

    if result:
      # Convert ObjectId to str for JSON serialization
      result['_id'] = str(result['_id'])
      return render_template('edit.html', content=result)
    else:
      return render_template('not_found.html'), 404
  except Exception as e:
    return render_template('error.html', error=str(e)), 500


@app.route('/spotreveal')
def spot_reveal():
  id_param = request.args.get('id')
  try:
    # Convert the string to ObjectId
    object_id = ObjectId(id_param)

    # Find document by _id
    result = collection.find_one({'_id': object_id})

    if result:
      # Convert ObjectId to str for JSON serialization
      result['_id'] = str(result['_id'])
      result['name'] = result['name']
      return render_template('spot_reveal.html', content=result)
    else:
      return render_template('not_found.html'), 404
  except Exception as e:
    return render_template('error.html', error=str(e)), 500


@app.route('/dialog', methods=['POST'])
def receive_text_data():
  data = request.get_json()
  text_data = data.get('text')
  print("hello from ", text_data)
  response = send_text_to_dialogflow(text_data)
  intent_name = response.query_result.intent.display_name
  fullfilment_text = response.query_result.fulfillment_text

  if intent_name == "date-picker":
    timestamp_str = response.query_result.parameters['date-time']
    timestamp = datetime.fromisoformat(timestamp_str)
    extracted_date = timestamp.date()
    extracted_month = timestamp.month
    extracted_year = timestamp.year
    extracted_date = timestamp.day
    return jsonify({
        "intent_name": intent_name,
        "cdate": extracted_date,
        "cmonth": extracted_month,
        "cyear": extracted_year
    })
  return jsonify({
      "intent_name": intent_name,
      "fullfilment_text": fullfilment_text
  })


def send_text_to_dialogflow(text):
  project_id = "ai-bot-qftk"

  # Generate a random session ID
  session_id = str(uuid.uuid4())

  session_client = dialogflow_v2.SessionsClient()
  session = session_client.session_path(project_id, session_id)

  text_input = dialogflow_v2.TextInput(text=text, language_code="en-US")
  query_input = dialogflow_v2.QueryInput(text=text_input)

  response = session_client.detect_intent(session=session,
                                          query_input=query_input)
  return response


if __name__ == "__main__":
  app.run(host='0.0.0.0', debug=True)
