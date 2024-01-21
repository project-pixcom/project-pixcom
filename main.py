from flask import Flask, render_template, request, make_response, jsonify
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
  datetime_object = datetime.strptime(text_data, "%Y-%d-%m")

  # Format the datetime object into a string with the desired format
  formatted_date = datetime_object.strftime("%Y-%m-%d")
  documents = collection.find({'date': formatted_date})
  contents = []
  for document in documents:
    date = document['date']
    model = document['model']
    name = document['name']
    id = document['_id']
    email = document['email']
    mobile = document['mobile']
    mb = document['mb']
    expert = document['expert']
    room = document['room']
    time = document['time']
    message = document['message']
    contents.append({
        'date': date,
        'model': model,
        'name': name,
        'id': id,
        'email': email,
        'mobile': mobile,
        'mb': mb,
        'expert': expert,
        'room': room,
        'time': time,
        'message': message
    })
  print("contents", contents)
  return render_template('event_content.html', contents=contents)


@app.route('/edit', methods=['POST'])
def edit_app():
  data = request.get_json()
  text_data = data.get('text')
  print("hello from ", type(text_data))
  try:
    # Convert the string to ObjectId
    object_id = ObjectId(text_data)

    # Find document by _id
    result = collection.find_one({'_id': object_id})

    if result:
      result = {
          'id': str(result['_id']),
          'name': result.get('name', ''),
          'email': result.get('email', ''),
          'mobile': result.get('mobile', ''),
          'mb': result.get('mb', 'option1'),
          'model': result.get('model', 'option1'),
          'expert': result.get('expert', 'option1'),
          'room': result.get('room', 'option1'),
          'date': result.get('date', ''),
          'time': result.get('time', ''),
          'message': result.get('message', '')
      }
      return render_template('edit.html', data=result)
    else:
      return render_template('not_found.html'), 404
  except Exception as e:
    return render_template('error.html', error=str(e)), 500


@app.route('/delete', methods=['POST'])
def delete_app():
  data = request.get_json()
  text_data = data.get('text')
  print("hello from ", type(text_data))
  try:
    # Convert the string to ObjectId
    object_id = ObjectId(text_data)

    criteria = {"_id": object_id}
    result = collection.delete_one(criteria)

    # Check the deletion result
    if result.deleted_count == 1:
      return jsonify({"message": "Deleted Sucessfully"}), 200
    else:
      return jsonify({"message": "Failed to Delete Appointment"}), 200
  except Exception as e:
    print(e)
    response_data = {'message': "Failed to Delete Appointment"}
    return jsonify(response_data), 500


@app.route('/spotreveal')
def spot_reveal():
  id_param = request.args.get('id')
  try:
    # Convert the string to ObjectId
    object_id = ObjectId(id_param)

    # Find document by _id
    result = collection.find_one({'_id': object_id})

    if result:
      result = {
          'id': str(result['_id']),
          'name': result.get('name', ''),
          'email': result.get('email', ''),
          'mobile': result.get('mobile', ''),
          'mb': result.get('mb', 'option1'),
          'model': result.get('model', 'option1'),
          'expert': result.get('expert', 'option1'),
          'room': result.get('room', 'option1'),
          'date': result.get('date', ''),
          'time': result.get('time', ''),
          'message': result.get('message', '')
      }
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
    if isinstance(timestamp_str, str) and timestamp_str != "":
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
    else:
      return jsonify({
          "intent_name": "Default Fallback Intent",
          "fullfilment_text": "Invalid date format"
      })
  elif intent_name == "select-app" or intent_name == "edit-app" or intent_name == "delete-app":
    rec_num_ordinal = response.query_result.parameters['ordinal']
    rec_num_number = response.query_result.parameters['number']
    rec_num = rec_num_ordinal if rec_num_number == '' else rec_num_number

    return jsonify({
        "intent_name": intent_name,
        "fullfilment_text": fullfilment_text,
        "rec_num": rec_num
    })
  elif intent_name == "month-selector":
    month_data = response.query_result.parameters['date-period']
    month = datetime.fromisoformat(month_data["startDate"])
    month_num = month.month - 1
    return jsonify({
        "intent_name": intent_name,
        "fullfilment_text": fullfilment_text,
        "month_num": month_num
    })
  return jsonify({
      "intent_name": intent_name,
      "fullfilment_text": fullfilment_text
  })


@app.route('/save_app', methods=['POST'])
def save_app():
  try:
    data = request.get_json()

    # Handle the data as needed
    name = data.get('name')
    email = data.get('email')
    mobile = data.get('mobile')
    mb = data.get('mb')
    date = data.get('datepicker')
    time = data.get('timepicker')
    model = data.get('model')
    expert = data.get('expert')
    room = data.get('room')
    message = data.get('message')
    data = {
        'name': name,
        'email': email,
        'mobile': mobile,
        'mb': mb,
        'model': model,
        'expert': expert,
        'room': room,
        'date': date,
        'time': time,
        'message': message
    }
    # Insert the data into MongoDB
    collection.insert_one(data)
    response_data = {'message': 'Appointment saved successfully'}
    return jsonify(response_data), 200
  except Exception as e:
    print(e)
    response_data = {'message': "Failed to Save Appointment"}
    return jsonify(response_data), 500


@app.route('/update_app', methods=['POST'])
def update_app():
  try:
    data = request.get_json()

    # Handle the data as needed
    id = data.get('id')
    name = data.get('name')
    email = data.get('email')
    mobile = data.get('mobile')
    mb = data.get('mb')
    date = data.get('datepicker')
    time = data.get('timepicker')
    model = data.get('model')
    expert = data.get('expert')
    room = data.get('room')
    message = data.get('message')
    data = {
        'name': name,
        'email': email,
        'mobile': mobile,
        'mb': mb,
        'model': model,
        'expert': expert,
        'room': room,
        'date': date,
        'time': time,
        'message': message
    }
    object_id = ObjectId(id)
    filter = {'_id': object_id}
    update_operation = {'$set': data}
    collection.update_one(filter, update_operation)
    response_data = {'message': 'Appointment updated successfully'}
    return jsonify(response_data), 200
  except Exception as e:
    print(e)
    response_data = {'message': "Failed to update Appointment"}
    return jsonify(response_data), 500


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
