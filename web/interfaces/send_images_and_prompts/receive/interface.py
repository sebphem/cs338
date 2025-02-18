from typing import List, Optional, Tuple

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

    def __repr__(self):
        return f"Preferences(Max Distance: {self.max_distance}, Age Range: {self.age_range})"


class UserData:
    def __init__(self, profile: Profile, preferences: Preferences, images: Optional[dict[str,str]] = None, prompts_filled: Optional[dict[str,str]] = None):
        self.profile = profile
        self.preferences = preferences
        self.images = images if images is not None else []
        self.prompts_filled = prompts_filled if prompts_filled is not None else []

    def __repr__(self):
        return f"UserData(Profile: {self.profile}, Preferences: {self.preferences}, Images: {len(self.images)} images, Prompts: {len(self.prompts_filled)} prompts)"