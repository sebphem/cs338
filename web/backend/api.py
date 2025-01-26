import argparse
from flask import Flask, request, jsonify

#import the functions from their respective folders
from common.criminals.parser import check_sex_offender



app = Flask(__name__)

@app.route('/api/so/', methods=['GET'])
def sexOffenders():
    
    return jsonify({'message': 'Hello, world!'})

@app.route('/api/greet/<name>', methods=['GET'])
def greet(name):
    return jsonify({'message': f'Hello, {name}!'})

@app.route('/api/data', methods=['POST'])
def data():
    json_data = request.get_json()
    if not json_data:
        return jsonify({'error': 'Invalid input'}), 400

    return jsonify({'received': json_data}), 200



def build_argparser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Backend for the server deployed locally")
    flask_opts = parser.add_argument_group("flask options")
    flask_opts.add_argument("-p", "--port",type=int,default=8000)
    return parser

if __name__ == "__main__":
    p_inst = build_argparser()
    opts = vars(p_inst.parse_args())
    app.run(debug=True, port=opts["port"])