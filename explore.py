import json
from flask import Flask, jsonify, request

app = Flask(__name__)

qep_json = [ { 'test': 1, 'test2': 'Ashley' }]

@app.route('/plan', methods=['GET'])
def get_qep():
 return jsonify(qep_json)

if __name__ == '__main__':
   app.run(port=5000)