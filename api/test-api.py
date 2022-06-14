from dataclasses import fields
import string
from struct import pack
from flask import Flask, abort
from flask_restful import Resource, Api, reqparse, fields, marshal_with
import pandas as pd
import ast

users_data = {
    'Jaume': [2, 5, 7],
    'Ton': [4, 8, 10]
}

location_data = {
    'London': [2],
    'Barcelona': [4]
}

#users = pd.DataFrame(users_data)
#locations = pd.DataFrame(location_data)
users = users_data
locations = location_data

app = Flask(__name__)
api = Api(app)
app.config['MONGODB_SETTINGS'] = {
    'db': 'testmodel',
    'host': 'localhost',
    'port': 27017
}
db = mongoengine()
db.init_app(app)

class Testmodel(db.Document):
    _id = db.IntField()
    task = db.StringField(required=True)
    summary = db.StringField(Requierd=True)



parser_users_list = reqparse.RequestParser()

parser_users_list.add_argument('username', type=str, help='Username is required', required=True)
parser_users_list.add_argument('value', type=str, help='Value is required', required=True)

parser_user = reqparse.RequestParser()
parser_user.add_argument('value', type=str, help='Value is required', required=True)

#Define endpoint methods
class UsersList(Resource):
    def get(self):
        data = users
        return data, 200 #Return data and 200 Ok code
    
    def post(self):
        args = parser_users_list.parse_args() #parse args to dict

        username = args['username']
        value = args['value']

        if username is None:
            abort(400, 'Username needed')

        value = value.split(', ')
        list_values = [int(i) for i in value]

        data = users
        if username in data.keys():
            abort(400, 'Username already in DB')
        data[username] = list_values
        return data, 200

class User(Resource):
    def get(self, user):
        return users[user], 200

    def post(self, user):
        args = parser_user.parse_args() #parse args to dict

        value = args['value']

        value = value.split(', ')
        list_values = [int(i) for i in value]

        todo = Testmodel(_id=user, task=value, summary='Test').save()

        """
        data = users
        if user in data.keys():
            abort(400, 'Username already in DB')
        data[user] = list_values
        return data, 200
        """
        return todo, 200

class Locations(Resource):
    def get(self):
        data = locations
        return data, 200

#Add endpoint
api.add_resource(UsersList, '/users')
api.add_resource(User, '/user/<string:user>')
api.add_resource(Locations, '/locations')

#Run Local Server
if __name__ == '__main__':
    app.run(debug=True)


