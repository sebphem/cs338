# uses AI to analyze given profile
from openai import OpenAI
import os
import re

def get_keys():
    return "key"

def analyze_pictures(pictures, profile):
    try:
        API_KEY = get_keys()
        client = OpenAI(api_key = API_KEY)
        chat = client.chat.completions.create(
            model = "gpt-4o",
            messages = [
                {"role": "system", "content": f"I'm going to give you multiple pictures, tell me which one makes me look the best for my profile of: {profile}"},
                {"role:":"user", "content": pictures }

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
        user_profile_description = f"Profile: {user_data}"
        main_prompt = f"Given this user profile description: {user_profile_description}, please tell me the top 3 prompts that match this user. Keep in mind the guidelines we have designed specified in all caps ended with a colon start now:"
        chat_prompts = [ "RULES AND GUIDELINES:",
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
        tips_and_tricks = ["Keep the profile prompt responses short, concise, and witty.", 
                           "Boldness",
                           "Honesty",
                           "A genuine personality",
                           "Answer Prompts in Ways That Will Intrigue Your Ideal Match",
                           "Be respectful",
                           "Don’t be a stereotype",
                           "Don’t be sexual in a disrespectful way",
                           "You shouldn’t include : Machu Picchu ,'Just ask', basic Pet peeves like 'Slow walkers', Any reference to The Office, Any reference to The Office ",
                           "Don’t be vague in prompts",
                           "Try to avoid politics",
                           "While keeping it brief and concise, avoid one to two word answers that can be considered boring",
                           "Keep it casual and sound like a 20ish year old"
                           ]
        chat = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": main_prompt},
            {"role": "system", "content": "\n".join(tips_and_tricks)},
            {"role": "user", "content": "\n".join(chat_prompts)}
        ],
        stream=False,
        )

        top_prompts = chat.choices[0].message.content
        return top_prompts
    except Exception as e:
        raise Exception("error in step_one():", e)


def step_two(user_data, prompts):
    try:
        API_KEY = get_keys()
        client = OpenAI(api_key = API_KEY)
        user_profile_description = f"Profile: {user_data}"
        tips_and_tricks = ["Keep the profile prompt responses short, concise, and witty.", 
                           "Boldness",
                           "Honesty",
                           "A genuine personality",
                           "Answer Prompts in Ways That Will Intrigue Your Ideal Match",
                           "Be respectful",
                           "Don’t be a stereotype",
                           "Don’t be sexual in a disrespectful way",
                           "You shouldn’t include : Machu Picchu ,'Just ask', basic Pet peeves like 'Slow walkers', Any reference to The Office, Any reference to The Office ",
                           "Don’t be vague in prompts",
                           "Try to avoid politics",
                           "While keeping it brief and concise, avoid one to two word answers that can be considered boring"
                           ]
        main_prompt = f"Given this user profile description: {user_profile_description}, You will be given 3 prompts and short answer details to those prompts, rewrite the short answers to be more engaging and interesting ot the users preferences. You can embellish the details as you see fit with the user profile and preferences. Keep in mind the guidelines specified by all caps ending with a colon. start now:"
        

        chat = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": main_prompt},
            {"role": "system", "content": "\n".join(tips_and_tricks)},
            {"role": "system", "content": "Here are my prompts:" + prompts}
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

    chat_history = "CHATGPT: What are your hobbies?\nYOU: I enjoy long walks on the beach\nCHATGPT: That's great! I currently don't have legs nor a body to walk with but is that important? Is it important for your partner to also enjoy walks on the beach?"
    user_answer =  "YOU: Not necessarily, but it would be cool if they were."
    while True:
        if user_answer == "quit":
            break
        chat_history += "\n" + "YOU:" + user_answer
        user_profile_with_optional["preferences"] += " " +user_answer
        print("\nhistory:", chat_history, "\n")
        ans = convo_answer(user_profile_with_optional, chat_history, user_answer)
        chat_history += "\n" + ans
        print(ans)
        user_answer = input()


    print(f"CHAT ENDED! information gathered: {user_profile_with_optional["preferences"]}")
    #print(user_preferences_with_optional)

    #ud = UserData(user_profile_with_optional, user_preferences_with_optional)
    prompts = step_one(user_profile_with_optional)
    print("STEP1:", prompts)
    #print("STEP2:", step_two(Profile(**user_profile_with_optional)), prompts)