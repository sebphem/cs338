from typing import List, Optional

class Profile:
    def __init__(self, 
                 name: str, 
                 age: int, 
                 height: int, 
                 location: str, 
                 dating_intentions: Optional[List[str]] = None, 
                 relationship_type: Optional[List[str]] = None, 
                 ethnicity: Optional[List[str]] = None, 
                 children: Optional[str] = None, 
                 family_plans: Optional[str] = None, 
                 covid_vaccine: Optional[bool] = None, 
                 pets: Optional[str] = None, 
                 zodiac: Optional[str] = None, 
                 work: Optional[str] = None, 
                 job_title: Optional[str] = None, 
                 school: Optional[str] = None, 
                 education: Optional[str] = None, 
                 religious_beliefs: Optional[str] = None, 
                 hometown: Optional[str] = None, 
                 politics: Optional[str] = None, 
                 languages: Optional[List[str]] = None, 
                 drinking: Optional[str] = None, 
                 smoking: Optional[bool] = None, 
                 weed: Optional[bool] = None, 
                 drugs: Optional[bool] = None):
        self.name = name
        self.age = age
        self.height = height
        self.location = location
        self.dating_intentions = dating_intentions if dating_intentions is not None else []
        self.relationship_type = relationship_type if relationship_type is not None else []
        self.ethnicity = ethnicity if ethnicity is not None else []
        self.children = children
        self.family_plans = family_plans
        self.covid_vaccine = covid_vaccine
        self.pets = pets
        self.zodiac = zodiac
        self.work = work
        self.job_title = job_title
        self.school = school
        self.education = education
        self.religious_beliefs = religious_beliefs
        self.hometown = hometown
        self.politics = politics
        self.languages = languages if languages is not None else []
        self.drinking = drinking
        self.smoking = smoking
        self.weed = weed
        self.drugs = drugs

    def __repr__(self):
        return f"Profile({self.name}, {self.age}, {self.location})"

if __name__== "__main__":
    # Example usage with required fields
    user_profile = Profile(
        name="John Doe",
        age=30,
        height=180,
        location="New York"
    )
    print(user_profile.__dict__)

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
