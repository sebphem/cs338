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

# does step one of our design, you send me information I send you prompts
def step_one(user_data):
    try:
        API_KEY = get_keys()
        client = OpenAI(api_key = API_KEY)
        user_profile_description = f"Profile: {user_data.profile.__dict__}"
        user_preferences_description = f"Preferences: {user_data.preferences.__dict__}"
        main_prompt = f"Given this user profile description: {user_profile_description} and preferences description: {user_preferences_description}, please tell me the top 3 prompts that match this user:"
        chat_prompts = [
    "Gender euphoria looks like",
    "Dating me is like",
    "What I order for the table",
    "I'm weirdly attracted to",
    "We'll get along if",
    "When I need advice, I go to",
    "My therapist would say I",
    "The way to win me over is",
    "I get myself out of a funk by",
    "Try to guess this about me",
    "My best celebrity impression",
    "My greatest strength",
    "Let's make sure we're on the same page about",
    "Best travel story",
    "I'm looking for",
    "I recently discovered that",
    "It feels affirming when others",
    "The boldest thing about me is",
    "Green flags I look for",
    "My best Dad Joke",
    "I'll pick the topic if you start the conversation",
    "Typical Sunday",
    "The last time I cried happy tears was",
    "Change my mind about",
    "The one thing I'd love to know about you is",
    "First round's on me if",
    "My Love Language is",
    "Unusual skills",
    "Weirdest gift I have given or received",
    "Something that's non-negotiable for me is",
    "Apparently, my life's soundtrack is",
    "If loving this is wrong, I don't want to be right",
    "The key to my heart is",
    "The best way to ask me out is by",
    "I go crazy for",
    "My most irrational fear",
    "What if I told you that",
    "The first time I knew I was gay was",
    "I wind down by",
    "This year, I really want to",
    "You should leave a comment if",
    "One thing I'll never do again",
    "The hallmark of a good relationship is",
    "My biggest date fail",
    "My simple pleasures",
    "My favorite LGBTQIA+ book is",
    "Don't hate me if I",
    "I hype myself up by",
    "I feel most supported when",
    "You should not go out with me if",
    "My self-care routine is",
    "Worst idea I've ever had",
    "I'm convinced that",
    "We're the same type of weird if",
    "A shower thought I recently had",
    "Give me travel tips for",
    "Saying 'Hi!' in as many languages I know",
    "Biggest risk I've taken",
    "Two truths and a lie",
    "Do you agree or disagree that",
    "My favorite LGBTQIA+-owned places",
    "A boundary of mine is",
    "My friends ask me for advice about",
    "Therapy recently taught me",
    "My favorite off-brand LGBTQIA+ icon is",
    "My happy place is",
    "My cry-in-the-car song is",
    "My BFF's take on why you should date me",
    "To me, relaxation is",
    "Teach me something about",
    "Never have I ever",
    "Together, we could",
    "How to pronounce my name",
    "Let's debate this topic",
    "A life goal of mine",
    "I'll fall for you if",
    "I won't shut up about",
    "I wish I could tell the younger version of myself",
    "I bet you can't",
    "I know the best spot in town for"
]
        chat = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": main_prompt},
            {"role": "user", "content": "\n".join(chat_prompts)}
        ],
        stream=False,
        )

        top_prompts = chat.choices[0].message.content
        return top_prompts
    except Exception as e:
        raise Exception("error in step_one():", e)


def step_two(user_data, prompts, prompt_answers):
    try:
        API_KEY = get_keys()
        client = OpenAI(api_key = API_KEY)
        user_profile_description = f"Profile: {user_data.profile.__dict__}"
        user_preferences_description = f"Preferences: {user_data.preferences.__dict__}"
        main_prompt = f"Given this user profile description: {user_profile_description} and preferences description: {user_preferences_description}, You will be given 3 prompts and short answer details to those prompts, rewrite the short answers to be more engaging and interesting ot the users preferences. You can embellish the details as you see fit with the user profile and preferences."
        
        temp = []
        for prompt, answer in zip(prompts, prompt_answers):
            data = prompt + " : " + answer
            temp.append(data)

        chat = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": main_prompt},
            {"role": "user", "content": "\n".join(temp)}
        ],
        stream=False,
        )
        return chat.choices[0].message.content
    
    except Exception as e:
        raise Exception("error in step_two():", e)


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
    from interface import Profile, Preferences, UserData
    #print(analyze_profile(text))
    # Example usage with required fields
    user_profile = Profile(
        name="John Doe",
        age=30,
        height=180,
        location="New York"
    )
    print(user_profile.__dict__)

     # Example usage with required fields
    user_preferences = Preferences(
        max_distance=50,
        age_range=(25, 35)
    )
    print(user_preferences.__dict__)

    ud = UserData(user_profile, user_preferences)
    print(ud.__dict__)

    # Example usage with optional fields included
    user_profile_with_optional = Profile(
        name="Jane Smith",
        age=25,
        height=165,
        location="California",
        dating_intentions=["Casual"],
        relationship_type=["Open"],
        pets="Cat",
        smoking=True,
        drinking="Occasionally"
    )

    print(user_profile_with_optional)

    # Example usage with optional fields included
    user_preferences_with_optional = Preferences(
        max_distance=100,
        age_range=(30, 40),
        relationship_type=["Serious", "Casual"],
        height_range=(160, 190),
        dating_intentions=["Long-term", "Marriage"],
        children="No Preference",
        family_plans="Wants kids",
        vices=["Smoking", "Drinking"],
        politics="Liberal",
        education="Graduate Degree"
    )
    
    print(user_preferences_with_optional)

    ud = UserData(user_profile_with_optional, user_preferences_with_optional)
    #print("STEP1:", step_one(ud))
    print("STEP2:", step_two(ud,["My happy place is", "My biggest date fail", "My BFF's take on why you should date me"], 
                             ["the beach", "I tripped and fell, spilling my scaling hot coffee on her.", "my BFF says I'm pretty rich and possibly funny"]))