import json
from flask import Flask, abort, jsonify
from flask_restful import Resource, Api, reqparse, fields, marshal_with
import pandas as pd
from flask_pymongo import PyMongo
import flask
from flask import request
from bson import json_util
import json
from bson import ObjectId
from flask_cors import CORS, cross_origin
from hashlib import md5
import uuid


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


app = Flask(__name__)
CORS(app)
api = Api(app)
mongodb_client = PyMongo(app, uri="mongodb://localhost:27017/friendslocation")
db = mongodb_client.db

@app.route('/locations', methods = ['GET', 'POST', 'DELETE'])
def request_locations():
    if request.method == 'GET':
        output = []
        locations = db.locations.find({})
        for location in locations:
            location['_id'] = json.dumps(location['_id'], cls=JSONEncoder)
            output.append(location)
        return jsonify(output), 200

    if request.method == 'POST':
        data = json.loads(request.data)
        userId = data['userId']
        friend = data['friend']
        country = data['country']
        city = data['city']
        street = data['street']

        location = {'country': country, 'city': city, 'street': street, 'userId': userId}

        if db.locations.count_documents(location):
            return {'error': 'Location already in db'}, 400

        id = db.locations.insert_one(location)
        db.friends.insert_one({'name': friend, 'location': id.inserted_id})

        return {'ok': 'Location Saved'}, 200

    if request.method == 'DELETE':
        country = request.args['country']
        city = request.args['city']
        street = request.args['street']

        location = {'country': country, 'city': city, 'street': street}

        if db.locations.count_documents(location):
            db.locations.delete_one(location)

            return 'Ok', 200
        
        else:
            return 'Value not existing in db', 400

@app.route('/friends', methods = ['GET', 'POST', 'DELETE'])
def request_friends():
    if request.method == 'GET':
        output = []
        friends = db.friends.find({})
        for friend in friends:
            friend['_id'] = json.dumps(friend['_id'], cls=JSONEncoder)
            friend['location'] = json.dumps(friend['location'], cls=JSONEncoder)
            output.append(friend)
        return jsonify(output), 200

@app.route('/getlocation/<friend_name>', methods = ['GET'])
def get_friend_location(friend_name):
    friend_value = db.friends.find({'name': friend_name})
    for friend in friend_value:
        id_location = friend['location']
    locations = db.locations.find({'_id': id_location})
    for location in locations:
        location['_id'] = json.dumps(location['_id'], cls=JSONEncoder)
        return location, 200

@app.route('/signup', methods = ['POST'])
def request_signup():
    data = json.loads(request.data)
    username = data['username']
    password = data['password']
    user = {'username': username, 'password': password, 'userId': str(uuid.uuid1())}
    db.users.insert_one(user)
    return {'ok': 'User added'}, 200

@app.route('/login', methods = ['POST'])
def request_login():
    data = json.loads(request.data)
    username = data['username']
    password = data['password']
    user = {'username': username, 'password': password}
    if db.users.find_one(user):
        user = db.users.find_one(user)
        response = {'token': user['userId']}
        return response, 200
    return {'error': 'User not existing'}, 400

@app.route('/user/exist', methods = ['POST'])
def check_user_exists():
    data = json.loads(request.data)
    username = data['username']
    user = db.users.find_one({'username': username})
    if user == None:
        return {'ok': 'User not exists'}, 200
    return {'error': 'User already exists'}, 404


@app.route('/getuser/<userId>', methods = ['GET'])
def request_get_user(userId):
    data = db.users.find_one({'userId': userId})
    return_data = {'username': data['username'], 'password': data['password']}
    return return_data, 200

@app.route('/getlocations/<userId>', methods = ['GET'])
def request_get_locations(userId):
    data = db.locations.find({'userId': userId})
    response = {}
    for index, d in enumerate(data):
        response[index] = {'country': d['country'], 'city': d['city'], 'street': d['street']}

    return response, 200

#Run Local Server
if __name__ == '__main__':
    app.run(debug=True)