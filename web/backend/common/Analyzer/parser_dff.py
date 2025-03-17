# uses AI to analyze given profile
from openai import OpenAI
import os
import re

def get_keys():
    return "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"

def analyze_pictures(pictures, profile):
    try:
        API_KEY = get_keys()
        client = OpenAI(api_key = API_KEY)
        IMAGE_PROMPT = """
"""
        chat = client.chat.completions.create(
            model = "gpt-4o",
            messages = [
                {"role": "system", "content": f"I'm going to give you multiple pictures, tell me which one makes me look the best for my profile of: {profile}"},
                {"role:":"user", "content": pictures }

            ],
            stream = False,
        )
        print('chat response: ', chat)
        return chat.choices[0].message.content
    except Exception as e:
        raise Exception("error:",e)


def rank_pictures(images, profile):
    try:
        # print('pictures: ', images)
        API_KEY = get_keys()
        client = OpenAI(api_key = API_KEY)
        IMAGE_PROMPT = """
You are about to receive multiple photos that are going to be used to make a dating profile.
You have to be overly critical and a complete jerk to the person in the photos.

The photos must be composed of:
    1 headshot of one person smiling
    2 photos of you hanging out with friends
    1 photo of a full body picture of the person standing
    2 funny photos
    1 travel photo

If they don't follow these exact criteria, you should get extremely mad at the person and go on long winded tangents about everyone should listen to you because you've had 4 failed marriages.
You must reply for at least 8 sentences.s
Give feedback on each of the photos in the following format:
[IMAGE NUMBER] - [RESPONSE]
"""
        user_content= []
        if images:
            for image in images:
                image_format = png_or_jpg(image)
                # if image_format == None:
                #     continue
                image_dataurl = f"data:image/{"png"};base64,{image}"
                user_content.append({"type": "image_url", "image_url": {"url": image_dataurl}})
        # print('user_content: ', user_content)
        chat = client.chat.completions.create(
            model = "gpt-4o",
            messages = [
                {"role": "system", "content": IMAGE_PROMPT},
                {"role":"user", "content":
                 user_content
                }

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
        main_prompt = f"Given this user profile description: {user_profile_description}, please tell me the top 3 prompts that match this user:"
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
        main_prompt = f"Given this user profile description: {user_profile_description}, You will be given 3 prompts and short answer details to those prompts, rewrite the short answers to be more engaging and interesting ot the users preferences. You can embellish the details as you see fit with the user profile and preferences."
        
        temp = [f"{prompt} : {answer}" for prompt,answer in zip(prompts,prompt_answers) ]

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

def convo_answer(user_profile, chat_history, user_answer):
    try:
        API_KEY = get_keys()
        client = OpenAI(api_key = API_KEY)
        main_prompt = f"You will be given a chat history (with you and the user in the past) and I want you to pretend to continue off from where you left off, keep in mind their profile {user_profile}. Everything you said will be prefaced with 'CHATGPT' and everything they say is prefaced with 'YOU' history:{chat_history}"
        
        prompt = "Generate a response to the user that sounds like you understand them within the context of course, and follow up with a follow-up question with the intention of getting more information out of them to fill out the user_profile. try to make it a slightly different question than ones already asked in history"

        chat = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": main_prompt},
            {"role": "user", "content": prompt}
        ],
        stream=False,
        )

        ans = chat.choices[0].message.content
        return ans
    
    except Exception as e:
        raise Exception("error in convo_answer():", e)

if __name__ == "__main__":
    text = """
    Last Name: Smith
    First Name: John
    BirthDate: 10-31-1995
    LinkedIn: No information
    Twitter: Follows family and friends; follows Capcom; follows Barack Obama; 42 posts in the last month
    Hobbies: plays Tennis;
    Crimes: None found"""
    from interface import Profile
    #print(analyze_profile(text))
    # Example usage with required fields
    # Example usage with optional fields included
    user_profile_with_optional = Profile(
        name="Jane Smith",
        age=25,
        height=165,
        location="California",
        dating_intentions=["Casual"],
        relationship_type=["Open"],
        pets="Cat",
        preferences = "",
        smoking=True,
        drinking="Occasionally"
    )
    user_profile_with_optional = user_profile_with_optional.__dict__

    # chat_history = "CHATGPT: What are your hobbies?\n YOU: I enjoy long walks on the beach\n CHATGPT: That's great! I currently don't have legs nor a body to walk with but is that important? Is it important for your partner to also enjoy walks on the beach?"
    # user_answer =  "YOU: Not necessarily, but it would be cool if they were."

    import base64
    from pathlib import Path
    import os

    def encode_image_to_base64(image_path):
        """
        Encodes an image to a Base64 string.

        Args:
            image_path: Path to the image file.

        Returns:
            The Base64 encoded string or None if an error occurs.
        """
        try:
            with open(image_path, "rb") as image_file:
                encoded_string = base64.b64encode(image_file.read()).decode("utf-8")
                # encoded_string = base64.b64encode(image_file.read()).decode("")
                return encoded_string
        except FileNotFoundError:
            print(f"Error: File not found at {image_path}")
            return None
        except Exception as e:
            print(f"An error occurred: {e}")
            return None
        
    images = [encode_image_to_base64(Path(os.path.abspath(__file__)).parent / '..' / '..' / 'test' / 'images' / 'b.png')]
    print(rank_pictures(images,None))
    # while True:
    #     if user_answer == "quit":
    #         break
    #     chat_history += "\n" + "YOU:" + user_answer
    #     user_profile_with_optional["preferences"] += " " +user_answer
    #     print("\nhistory:", chat_history, "\n")

    #     print(convo_answer(user_profile_with_optional, chat_history, user_answer))
    #     user_answer = input()


    # print(f"CHAT ENDED! information gathered: {user_profile_with_optional["preferences"]}")
    #print(user_preferences_with_optional)

    #ud = UserData(user_profile_with_optional, user_preferences_with_optional)
    #print("STEP1:", step_one(ud))
    #print("STEP2:", step_two(ud,["My happy place is", "My biggest date fail", "My BFF's take on why you should date me"], 
                             #["the beach", "I tripped and fell, spilling my scaling hot coffee on her.", "my BFF says I'm pretty rich and possibly funny"]))