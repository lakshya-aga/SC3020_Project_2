from flask import Flask, jsonify, request
from flask_restful import Api, Resource
from flask_cors import CORS, cross_origin
import psycopg2
import logging
import os
# <<<<<<< HEAD


import json 

PORTNUMBER = "5430"
PASSWORD = "banach"
USER = "postgres"

app = Flask(__name__)
cors = CORS(app, resources={r"/explain": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/explain', methods=['GET'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def get(self):
    response = jsonify({'message': 'Use Post to send SQL'})
    response.status_code = 400
    return response
cors = CORS(app, resources={r"/explain": {"origins": "*"}, r"/authenticate": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/explain', methods=['GET'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def get(self):
    response = jsonify({'message': 'Use Post to send SQL'})
    response.status_code = 400
    return response


@app.route('/explain', methods=['POST'])
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
def post():
    requestJSON = request.get_json()  # status code

    querySQL = requestJSON.get("sql")
    if querySQL is None:
        response = jsonify({'message': 'Send SQL in Request !!  '})
        response.status_code = 400
        return response
    
    f = open('authDetails.json')
    data = json.load(f)
    
    dbHostIP = data["dbHostIP"]
    dbPort = data["dbPort"]
    dbName = data["dbName"]
    dbUser = data["dbUser"]
    dbPassword = data["dbPassword"]
    print(dbHostIP, dbPort, dbName, dbUser, dbPassword)
    explainQuerySQL = "explain (analyze, verbose, BUFFERS, FORMAT json) " + querySQL

    # Establish the connection
    try:
        conn = psycopg2.connect(
            database=dbName, user=dbUser, password=dbPassword, host=dbHostIP, port=dbPort
        )
    except Exception as err:
        response = jsonify({'DbConnection': 'Failed : ' + str(err)})
        response.status_code = 400
        return response

    # #
    cursor = conn.cursor()
    cursor.execute("SET search_path TO tpch1g")
    try:
        cursor.execute(explainQuerySQL)
    except Exception as err:

        response = jsonify({'message': str(err)})

        response.status_code = 400
        return response
    
    response.headers['Access-Control-Allow-Origin'] = '*'
    response = cursor.fetchall()[0]
    # response.status_code = 200
    # conn.close()
    # os.system("rm authDetails.json")
    return response
    #

@app.route('/authenticate', methods=['GET'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def getAuth(self):
    response = jsonify({'message': 'Use Post to send SQL'})
    response.status_code = 400
    return response
    # Corresponds to POST request

@app.route('/authenticate', methods=['POST'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def postAuth():
        requestJSON = request.get_json()  # status code
        dbHostIP =  requestJSON.get("dbHostIP")
        dbPort = requestJSON.get("dbPort")
        dbName   = requestJSON.get("dbName")
        dbUser   = requestJSON.get("dbUser")
        dbPassword = requestJSON.get("dbPassword")
        print(dbPassword, dbUser, dbName, dbPort, dbHostIP)

        # Establish the connection
        try:
            conn = psycopg2.connect(
                database=dbName, user=dbUser, password=dbPassword, host=dbHostIP, port=dbPort
            )
            with open("authDetails.json", "w") as outfile: 
                json.dump(requestJSON, outfile)
        except Exception as err:
            response = jsonify({'DbConnection': 'Failed : ' + str(err)})
            response.status_code = 400
            return response

        #
        response = jsonify({'DbConnection': 'Successful'})
        #response.status_code = 200
        return response



if __name__ == '__main__':

    app.run(debug=True)
