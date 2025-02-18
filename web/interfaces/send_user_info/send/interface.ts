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
}

function testUserData() {
    const userProfile: Profile = {
        name: "John Doe",
        age: 30,
        height: 180,
        location: "New York",
        dating_intentions: ["Serious", "Casual"],
        relationship_type: ["Monogamous"],
        pets: "Dog",
        smoking: false,
        drinking: "Occasionally"
    };

    const userPreferences: Preferences = {
        max_distance: 50,
        age_range: [25, 35],
        relationship_type: ["Serious"],
        height_range: [160, 190],
        dating_intentions: ["Long-term"],
        children: "No Preference",
        family_plans: "Wants kids",
        vices: ["Drinking"],
        politics: "Liberal",
        education: "Graduate Degree"
    };

    const userData: UserData = {
        profile: userProfile,
        preferences: userPreferences
    };
    console.log("user data:" );
    console.log(JSON.stringify(userData));
}

testUserData();


function testLowLevelUserData() {
    const userData: UserData = {
        profile: {
            name: "John Doe",
            age: 30,
            height: 180,
            location: "New York",
            dating_intentions: ["Serious", "Casual"],
            relationship_type: ["Monogamous"],
            pets: "Dog",
            smoking: false,
            drinking: "Occasionally"
        },
        preferences: {
            max_distance: 50,
            age_range: [25, 35],
            relationship_type: ["Serious"],
            height_range: [160, 190],
            dating_intentions: ["Long-term"],
            children: "No Preference",
            family_plans: "Wants kids",
            vices: ["Drinking"],
            politics: "Liberal",
            education: "Graduate Degree"
        }
    };
    console.log("user data:" );
    console.log(JSON.stringify(userData));
}