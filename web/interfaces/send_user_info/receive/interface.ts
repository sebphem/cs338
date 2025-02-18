interface Profile {
    name: string;
    age: number;
    height: number;
    location: string;
    dating_intentions?: string[];
    relationship_type?: string[];
    ethnicity?: string[];
    children?: string;
    family_plans?: string;
    covid_vaccine?: boolean;
    pets?: string;
    zodiac?: string;
    work?: string;
    job_title?: string;
    school?: string;
    education?: string;
    religious_beliefs?: string;
    hometown?: string;
    politics?: string;
    languages?: string[];
    drinking?: string;
    smoking?: boolean;
    weed?: boolean;
    drugs?: boolean;
}

interface Preferences {
    max_distance: number;
    age_range: [number, number];
    relationship_type?: string[];
    height_range?: [number, number];
    dating_intentions?: string[];
    children?: string;
    family_plans?: string;
    vices?: string[];
    politics?: string;
    education?: string;
}

interface UserData{
    profile: Profile;
    preferences: Preferences;
    prompts: string[];
}
