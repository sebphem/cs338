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
        profile_data = data.get("profile", {}) # type: ignore

        if profile_data: # unpack data into profile and preferences
            user_profile = profile_data

            from common.Analyzer.parser import step_one
            top_prompts = step_one(user_profile)
            return jsonify({"prompts": top_prompts, "profile":user_profile}), 200
        else:
            return jsonify({"error step_one": "something went wrong with unpacking profile", "data":data}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# given the user's response to the prompts, flesh them out and return
@app.route("/step-two-prompts", methods=["POST"])
def step_two():
    try:
        data = request.json
        log.debug(f"Step two called with: {data}")
        profile_data = data.get("profile", {}) # type: ignore
        prompt_answers = data.get("prompt_answers", []) # type: ignore
        prompts = data.get("prompts", []) # type: ignore
        from interface import Profile

        if profile_data and prompt_answers and prompts: # unpack data into profile and preferences
            user_profile = Profile(**profile_data)

            from common.Analyzer.parser import step_two
            fleshed_out_prompts = step_two(user_profile, prompts, prompt_answers)
            return jsonify({"fleshed_out_prompts": fleshed_out_prompts, "profile":user_profile, "prompt_answers:": prompt_answers}), 200
        else:
            return jsonify({"error": "something went wrong with unpacking profile and preferences and prompt_answers", "data":data}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# called with POST and give the user profile and an array of dataurl pictures
@app.route("/best-picture", methods=["POST"])
def best_picture():
    try:
        data = request.json
        log.debug(f"best_picture called with: {data}")
        profile_data = data.get("profile", {}) # type: ignore
        pictures = data.get("pictures", [])
        from interface import Profile

        if profile_data and pictures: # unpack data into profile and preferences
            user_profile = Profile(**profile_data)

            from common.Analyzer.parser import analyze_pictures
            best_picture = analyze_pictures(profile_data, pictures)
            return jsonify({"picture": best_picture, "profile":user_profile}), 200
        else:
            return jsonify({"error": "something went wrong with unpacking profile or pictures was empty", "data:": data}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# called with POST and starts a conversation to fill in details about the user
@app.route("/convo_answer", methods=["POST"])
def conversation_answer():
    try:
        data = request.json
        log.debug(f"convo_ans called with: {data}")
        profile = data.get("profile", {})
        chat_history = data.get("history", None)
        user_answer = data.get("user_answer", None)
        profile["preferences"] += " " + user_answer
        user_answer = "YOU:" + user_answer

        if not profile or not chat_history or not user_answer:
            return jsonify({"error": "expected profile, history, and user_answer", "data": data}),400
        

        from common.Analyzer.parser import convo_answer

        ans = convo_answer(profile, chat_history, user_answer)
        chat_history += user_answer
        return jsonify({"profile": profile, "history": chat_history, "response": ans}), 200

        return 


        

    except Exception as e:
        return jsonify({"error in convo": str(e)}), 500
    
# called with POST and starts a conversation to fill in details about the user
@app.route("/redditscrape", methods=["POST"])
def scrape_reddit():
    try:
        data = request.json
        log.debug(f"scrape_reddit called with: {data}")
        username = data.get("username", None)
        if not username:
            return jsonify({"error": "Expected your JSON to have 'username'"}),400

        from common.Analyzer.parser import scrape_redditaccount
        ans = scrape_redditaccount(username)
        return jsonify({"response:": ans}), 200


        

    except Exception as e:
        return jsonify({"error in reddit scrape": str(e)}), 500


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
