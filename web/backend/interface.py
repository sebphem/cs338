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


from typing import List, Optional, Tuple

class Preferences:
    def __init__(self,
                 max_distance: int,
                 age_range: Tuple[int, int],
                 relationship_type: Optional[List[str]] = None,
                 height_range: Optional[Tuple[int, int]] = None,
                 dating_intentions: Optional[List[str]] = None,
                 children: Optional[str] = None,
                 family_plans: Optional[str] = None,
                 vices: Optional[List[str]] = None,
                 politics: Optional[str] = None,
                 education: Optional[str] = None):
        self.max_distance = max_distance
        self.age_range = age_range
        self.relationship_type = relationship_type if relationship_type is not None else []
        self.height_range = height_range
        self.dating_intentions = dating_intentions if dating_intentions is not None else []
        self.children = children
        self.family_plans = family_plans
        self.vices = vices if vices is not None else []
        self.politics = politics
        self.education = education


class UserData(Profile, Preferences):
    def __init__(self, profile: Profile, preferences: Preferences):
        self.profile = profile
        self.preferences = preferences

    def __dict__(self):
        return {
            "profile": vars(self.profile),
            "preferences": vars(self.preferences),
        }

if __name__== "__main__":
    from pprint import pprint
    # Example usage with required fields
    user_profile = Profile(
        name="John Doe",
        age=30,
        height=180,
        location="New York"
    )
    # pprint(user_profile.__dict__)

     # Example usage with required fields
    user_preferences = Preferences(
        max_distance=50,
        age_range=(25, 35)
    )
    # pprint(user_preferences.__dict__)

    ud = UserData(user_profile, user_preferences)
    pprint(ud.__dict__())

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

    # pprint(user_profile_with_optional)

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
    
    # pprint(user_preferences_with_optional)

    ud = UserData(user_profile_with_optional, user_preferences_with_optional)
    pprint(ud.__dict__())
