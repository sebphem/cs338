# uses AI to analyze given profile
from openai import OpenAI
import os
from ..api_keys.parser import get_keys
import re
def analyze_profile(profile):
    try:
        keys = get_keys()
        API_KEY = keys["keys"]["OPENAI_API_KEY"]
        client = OpenAI(api_key = API_KEY)
        chat = client.chat.completions.create(
            model = "gpt-3.5-turbo",
            messages = [
                {"role": "system", "content": "You are a psychologist and private investigator. I'm going to hand you a profile and I want you to analyze everything you can off of it. Tell me your reasoning as well."},
                {"role:":"user", "content": profile}

            ],
            stream = False,
        )
        return chat.choices[0].message.content
    except Exception as e:
        raise Exception("error:",e)

def png_or_jpg(base64_str):
    # code to check if something is a png or a jpg (from stackoverflow not 100% is this works or not)
    if re.match(r"^/9j/", base64_str):  # JPEG files start with /9j
        return "jpeg"
    elif re.match(r"^iVBORw0KGgo=", base64_str):  # PNG files start with iVBORw0KGgo=
        return "png"
    else:
        return None  # Unknown format


def analyze_images(images):
    try:
        keys = get_keys()
        API_KEY = keys["keys"]["OPENAI_API_KEY"]
        responses = []
        client = OpenAI(api_key=API_KEY)

        for image in images:
            image_format = png_or_jpg(image)
            if image_format == None:
                return None # give back to endpoint
            
            image_dataurl = f"data:image/{image_format};base64,{image}"

            # gpt-4-vision is the one that recognizes images, can't use other models sadly
            response = client.chat.completions.create(
                model="gpt-4-vision-preview",
                messages=[
                    {"role": "user", "content": [
                        {"type": "text", "text": "Can you analyze what the person is doing in this image? and what else they may enjoy doing?"},
                        {"type": "image_url", "image_url": {"url": image_dataurl}}
                    ]}
                ]
            )
        responses.append(response.choices[0].message.content) # add the analysis to arr

        return responses


    except Exception as e:
        raise Exception("error in analyze images:", e)    


if __name__ == "__main__":
    text = """
    Last Name: Smith
    First Name: John
    BirthDate: 10-31-1995
    LinkedIn: No information
    Twitter: Follows family and friends; follows Capcom; follows Barack Obama; 42 posts in the last month
    Hobbies: plays Tennis;
    Crimes: None found"""

    print(analyze_profile(text))