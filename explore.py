from flask import Flask, jsonify, request
from flask_restful import Api, Resource
from flask_cors import CORS, cross_origin
import psycopg2
import logging

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


@app.route('/explain', methods=['POST'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def post():
    request_json = request.get_json()
    query_sql = request_json.get("sql")

    if query_sql is None:
        response = jsonify({'message': 'Send SQL in Request !!  '})
        response.status_code = 400
        return response

    explain_query_sql = "explain (analyze, verbose, BUFFERS, FORMAT json) " + query_sql

    try:
        conn = psycopg2.connect(
            database="postgres", user=USER, password=PASSWORD, host='127.0.0.1', port=PORTNUMBER
        )

        cursor = conn.cursor()
        cursor.execute("SET search_path TO tpch1g")
        cursor.execute(explain_query_sql)
        response_data = cursor.fetchall()[0]


        response = jsonify(response_data)
        response.status_code = 200
        # response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response

    except Exception as err:
        response = jsonify({'message': str(err)})
        response.status_code = 400
        return response

    finally:
        conn.close()



if __name__ == '__main__':

    app.run(debug=True)
