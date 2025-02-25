import argparse
import sys
from pathlib import Path
import os
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

#import the functions from their respective folders
#from common.criminals.parser import check_sex_offender
# from common.social_medias.linkedin import
from common.img_to_base64 import image_to_base64

from logs.create_log import build_logger

log = build_logger(Path(os.path.abspath('.')) / 'logs' / 'api.log')
app = Flask(__name__)
CORS(app)


# endpoint to return top 3 prompts for step one
@app.route("/step-one-prompts", methods=["POST"])
def step_one():
    try:
        data = request.json
        log.debug(f"Step one called with: {data}")
        profile_data = data.get("profile", {})
        from ..interfaces.send_user_info.send.interface import Profile, UserData

        if profile_data and preferences_data: # unpack data into profile and preferences
            user_profile = Profile(**profile_data)
            user_preferences = Preferences(**preferences_data)
            user_data = UserData(user_profile, user_preferences)

            from common.Analyzer.parser import step_one
            top_prompts = step_one(user_data)
            return jsonify({"prompts": top_prompts, "UserData": user_data}), 200
        else:
            return jsonify({"error: something went wrong with unpacking profile and preferences"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# given the user's response to the prompts, flesh them out and return
@app.route("/step-one-prompts", methods=["POST"])
def step_two():
    try:
        data = request.json
        log.debug(f"Step two called with: {data}")
        profile_data = data.get("profile", {})
        preferences_data = data.get("preferences", {})
        prompt_answers = data.get("prompt_answers", [])
        prompts = data.get("prompts", [])
        from ..interfaces.send_user_info.send.interface import Profile, Preferences, UserData

        if profile_data and preferences_data and prompt_answers and prompts: # unpack data into profile and preferences
            user_profile = Profile(**profile_data)
            user_preferences = Preferences(**preferences_data)
            user_data = UserData(user_profile, user_preferences)

            from common.Analyzer.parser import step_two
            fleshed_out_prompts = step_two(user_data, prompt_answers)
            return jsonify({"prompts": fleshed_out_prompts, "UserData": user_data, "prompts":prompts, "prompt_answers:": prompt_answers}), 200
        else:
            return jsonify({"error: something went wrong with unpacking profile and preferences and prompt_answers"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

#pretty good example of how to write an api endpoint
@app.route('/api/so/', methods=['GET'])
def sexOffenders():
    #log.debug is exactly like printf in c
    log.debug(f"so endpoint called with args: {vars(request.args)}")
    try:
        firstname = request.args.get("firstname",type=str)
        last = request.args.get("lastname",type=str)
        #dob = request.args.get("dob",type=str)
        #date_object = datetime.strptime(dob, "%Y-%m-%d") if dob else None
        from common.criminals.parser import check_sex_offender
        #res = check_sex_offender(**{**request.args, "dob_object":date_object})
        res = check_sex_offender(**{**request.args}) # dont need DOB for demo, screwing w/ me running tests on this
        #if res["status"] == 1:
        if res["status"] == -1:
            return jsonify({"num_matches": 0, "matches": None}), 200
        else:
            return jsonify({'num_matches': len(res["body"]), # type: ignore
                                'matches': res["body"]}), 200
        #else:
        #    return jsonify({'num_matches': 0, # type: ignore
        #                    'matches': {}}), 400
    except Exception as err:
        log.error("Unexpected error occurred: ", err, "args:", request.args)
        return jsonify({'error': 'An unexpected error occurred. Please try again later.'}), 500

@app.route('/api/data', methods=['POST'])
def blacklist():
    json_data = request.get_json()
    if not json_data:
        return jsonify({'error': 'Invalid input'}), 400
    else:
        if "firstname" and "lastname" not in json_data:
            return jsonify({"error": "expected firstname and lastname"}), 400
        try:
            firstname = json_data["firstname"]
            lastname = json_data["lastname"]
            from common.No_Check_List.parser import add_name
            add_name(lastname, firstname)
            return jsonify({"status": "received, added to list"})
        except Exception as err:
            log.error("Unexpected error occurred: ", err)
            return jsonify({'error': 'An unexpected error occurred. Please try again later.'}), 500


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
        description="Backend for the server deployed locally",
        prog="api"
        )
    flask_opts = parser.add_argument_group("flask options")
    flask_opts.add_argument("-p", "--port",type=int,default=8000)
    return parser

if __name__ == "__main__":
    p_inst = build_argparser()
    opts = vars(p_inst.parse_args())
    app.run(debug=True, port=opts["port"])
