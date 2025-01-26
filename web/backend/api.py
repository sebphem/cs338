import argparse
import sys
from pathlib import Path
import os
from datetime import datetime
from flask import Flask, request, jsonify

#import the functions from their respective folders
from common.criminals.parser import check_sex_offender
from logs.create_log import build_logger

log = build_logger(Path(os.path.abspath('.')) / 'logs' / 'api.log')
app = Flask(__name__)


#pretty good example of how to write an api endpoint
@app.route('/api/so/', methods=['GET'])
def sexOffenders():
    #log.debug is exactly like printf in c
    log.debug(f"so endpoint called with args: {vars(request.args)}")
    try:
        firstname = request.args.get("first",type=str)
        last = request.args.get("last",type=str)
        dob = request.args.get("dob",type=str)
        date_object = datetime.strptime(dob, "%Y-%m-%d") if dob else None
        res = check_sex_offender(**{**request.args, "dob_object":date_object})
        if res["status"] == 1:
            return jsonify({'num_matches': len(res["body"]), # type: ignore
                            'matches': res["body"]}), 200
        else:
            return jsonify({'num_matches': 0, # type: ignore
                            'matches': {}}), 400
    except Exception as err:
        log.error("Unexpected error occurred: ", err)
        return jsonify({'error': 'An unexpected error occurred. Please try again later.'}), 500

@app.route('/api/data', methods=['POST'])
def blacklist():
    json_data = request.get_json()
    if not json_data:
        return jsonify({'error': 'Invalid input'}), 400

    return jsonify({'received': json_data}), 200

@app.route('/', methods=['GET'])
def list_endpoints():
    """
    List all registered routes in the application.
    """
    routes = []
    for rule in app.url_map.iter_rules():
        # Skip the endpoint if it's not associated with a function
        if rule.endpoint != 'static':
            routes.append({
                'endpoint': rule.endpoint,
                'methods': list(rule.methods), #type: ignore
                'url': str(rule)
            })
    return jsonify({'routes': routes})


def build_argparser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Backend for the server deployed locally"
        prog="api")
    flask_opts = parser.add_argument_group("flask options")
    flask_opts.add_argument("-p", "--port",type=int,default=8000)
    return parser

if __name__ == "__main__":
    p_inst = build_argparser()
    opts = vars(p_inst.parse_args())
    app.run(debug=True, port=opts["port"])