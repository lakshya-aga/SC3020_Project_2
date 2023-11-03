# using flask_restful
from flask import Flask, jsonify, request, make_response
from flask_restful import Resource, Api
import psycopg2

PORTNUMBER = 5342
PASSWORD = 'password'
USER = 'postgres'

# creating the flask app
app = Flask(__name__)
# creating an API object
api = Api(app)


# making a class for a particular resource
# the get, post methods correspond to get and post requests
# they are automatically mapped by flask_restful.
# other methods include put, delete, etc.
class ExplainService(Resource):

    # corresponds to the GET request.
    # this function is called whenever there
    # is a GET request for this resource
    def get(self):

        response = jsonify({'message': 'Use Post to send SQL'})
        response.status_code = 400
        return response

    # Corresponds to POST request
    def post(self):
        requestJSON = request.get_json()  # status code
        querySQL = requestJSON.get("sql")
        if querySQL is None:
            response = jsonify({'message': 'Send SQL in Request !!  '})
            response.status_code = 400
            return response
        explainQuerySQL = "explain (analyze, verbose, BUFFERS, FORMAT json) " + querySQL

        # Establish the connection
        conn = psycopg2.connect(
            database="postgres", user=USER, password=USER, host='127.0.0.1', port=PORTNUMBER
        )
        #
        cursor = conn.cursor()
        cursor.execute("SET search_path TO tpch1g")
        try :
            cursor.execute(explainQuerySQL)
        except Exception as err:

            response = jsonify({'message': str(err)})
            response.status_code = 400
            return response
        response = cursor.fetchall()[0]
        #response.status_code = 200
        return response
        #
        conn.close()



api.add_resource(ExplainService, '/explain')


# driver function
if __name__ == '__main__':
    app.run(debug=True)