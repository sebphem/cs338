# uses AI to analyze given profile
from openai import OpenAI
import os
from ..api_keys.parser import get_keys
def analyze_profile(profile):
    keys = get_keys()
    API_KEY = keys["keys"]["OPENAI_API_KEY"]
    try:
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