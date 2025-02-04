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


@app.route('/api/generate-profile/', methods=['GET'])
def generateProfileEndpoint():
    #log.debug is exactly like printf in c
    log.debug(f"generateProfile endpoint called with args: {vars(request.args)}")
    try:
        first = request.args.get("first",type=str,default=None)
        last = request.args.get("last",type=str, default=None)
        dob = request.args.get("dob",type=str, default=None)
        known_aliases = request.args.get("known-aliases",type=list[str], default=None)
        insta = request.args.get("insta",type=str, default=None)
        reddit = request.args.get("reddit",type=str, default=None)
        linkedin = request.args.get("linkedin",type=str, default=None)
        youtube = request.args.get("youtube",type=str)
        date_object = datetime.strptime(dob, "%Y-%m-%d") if dob else None
        
        # TODO: actually implement this
        # res = generateProfile(**{, "dob_object":date_object})

        res = "asdfasdf"
        image_1 = image_to_base64(Path(os.path.abspath('.')) / 'test' / 'images' / 'test_1.webp')
        image_2 = image_to_base64(Path(os.path.abspath('.')) / 'test' / 'images' / 'test_2.jpg')
        if res:
            return jsonify({'sections':[
                            {'text': "Gojo Satoru’s online presence is exactly what you’d expect from the world’s strongest sorcerer—unapologetically flashy, effortlessly charismatic, and borderline infuriating. His Twitter (or X) is a chaotic mix of smug one-liners, cryptic hints about jujutsu society, and relentless trolling of his students and fellow sorcerers. His Instagram is filled with aesthetic shots of him traveling to exotic locations, effortlessly stylish blindfold selfies, and the occasional cursed technique flex, just to remind everyone who’s on top. On TikTok, he seamlessly blends humor and power, casually demonstrating Infinity while participating in absurd trends, making even the most ridiculous videos go viral. Gojo thrives in the spotlight, using his platforms as both entertainment and a way to subtly challenge the rigid structures of the jujutsu world. Whether he’s engaging with fans or simply showing off, his presence online is as magnetic as it is unpredictable—because, of course, Gojo Satoru never does anything halfway.", # type: ignore
                            'image': image_1},
                            {'text':
                             "Gojo Satoru’s physical appearance in photos is nothing short of striking, effortlessly capturing attention no matter the setting. With his signature blindfold or dark-tinted sunglasses, he exudes an air of mystery that only adds to his undeniable charisma. When he does reveal his eyes—those mesmerizing Six Eyes shimmering in shades of crystalline blue—the internet practically breaks. His stark white hair, always slightly tousled yet impossibly stylish, frames his sharp features, giving him an almost ethereal look. Whether he's smirking in a perfectly lit, high-contrast black-and-white shot or caught mid-laugh in a candid, his presence is magnetic. Even in casual photos, he somehow looks like he just stepped out of a high-fashion editorial—whether he’s lounging in oversized streetwear, donning his sleek sorcerer’s uniform, or effortlessly pulling off a tailored suit. The angles, the lighting, the confidence—it all makes every image of Gojo feel like it was meant to go viral.", # type: ignore
                            'image': image_2}
                            ]}), 200
        else:
            return jsonify({'num_matches': 0, # type: ignore
                            'matches': {}}), 400
    except Exception as err:
        log.error("Unexpected error occurred: ", err)
        return jsonify({'error': 'An unexpected error occurred. Please try again later.'}), 500

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
