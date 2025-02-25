# uses AI to analyze given profile
import openai
from openai import OpenAI
import os
import sys
from pathlib import Path
sys.path.append(str(Path(os.path.abspath(__file__)).parent / '..'))
from api_keys.parser import get_keys
import re
from img_to_base64 import image_to_base64

keys = get_keys()
# API_KEY = keys["keys"]["OPENAI_API_KEY"]
# print('api key: |||', API_KEY ,'||')
openai.api_key = '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'

def profile_generator(prompt, images, model="gpt-4"):
    print('inside chat with gpt')
    try:
        
        user_content= [{"type": "text", "text":prompt}] if prompt else []
        if images:
            for image in images:
                image_format = png_or_jpg(image)
                if image_format == None:
                    continue
                
                image_dataurl = f"data:image/{image_format};base64,{image}"
                user_content.append({"type": "image_url", "image_url": {"url": image_dataurl}})
        agent_prompt="""
                You are creating a dating profile for the person who is going to give you their information. Make sure to write in the first person
                You have to make the following sections of the profile:
                - Bio: make the person sound cool and interesting but also humble. Do NOT exceed 3 lines.
                - Hobbies: look at the iamges the person provided and understand what hobbies the person would be into.
                - Age: guess the age of the person
                - Education: guess the education level and where they went to university
                
                And give an answer that the person would give to the following prompts:
                - Two truths and a lie about me
                - My party trick is
                - My pet peeve is
                """
        res = openai.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": agent_prompt},
                    {"role": "user", "content": user_content}, # type: ignore
                ],
                max_tokens=1000,
                temperature=0.7
            )
        # Extracting the response text
        message = res.choices[0].message.content
        return message
    except Exception as e:
        return f"Error: {e}"

def png_or_jpg(base64_str):
    # code to check if something is a png or a jpg (from stackoverflow not 100% is this works or not)
    if re.match(r"^/9j/", base64_str):  # JPEG files start with /9j
        return "jpeg"
    elif re.match(r"^iVBORw0KGgo=", base64_str):  # PNG files start with iVBORw0KGgo=
        return "png"
    else:
        return None  # Unknown format

if __name__ == "__main__":
    # text = """
    # Last Name: Smith
    # First Name: John
    # BirthDate: 10-31-1995
    # LinkedIn: No information
    # Twitter: Follows family and friends; follows Capcom; follows Barack Obama; 42 posts in the last month
    # Hobbies: plays Tennis;
    # Crimes: None found"""
    # print(analyze_profile(text))
    print(profile_generator("My name is Sebastian Phmister, Im a fourth year in university and I play a lot of volleyball",images=[image_to_base64(Path(os.path.abspath(__file__)).parent / '..' / '..' / 'test' / 'images' / 'img_3.jpg')]))