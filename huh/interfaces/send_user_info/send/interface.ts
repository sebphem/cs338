interface Profile {
    name: string;
    age: number;
    height: number;
    location: string;
    preferences?: string;
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

interface UserData{
    profile: Profile;
};

function testUserData() {
    const userProfile: Profile = {
        name: "John Doe",
        age: 30,
        height: 180,
        location: "New York",
        preferences: "I'm looking for a man with a dog",
        dating_intentions: ["Serious", "Casual"],
        relationship_type: ["Monogamous"],
        pets: "Dog",
        smoking: false,
        drinking: "Occasionally"
    };

    const userData: UserData = {
        profile: userProfile
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
            preferences: "I'm looking for a man with a dog",
            dating_intentions: ["Serious", "Casual"],
            relationship_type: ["Monogamous"],
            pets: "Dog",
            smoking: false,
            drinking: "Occasionally"
        }
    };
    console.log("user data:" );
    console.log(JSON.stringify(userData));
}

export {Profile}