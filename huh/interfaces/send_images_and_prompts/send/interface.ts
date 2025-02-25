import { Profile } from "../../send_user_info/send/interface";
interface FilledPrompt{
    prompt: string;
    answer: string;
}

interface UserData{
    profile: Profile;
    images: string[];
    prompts_filled: FilledPrompt[];
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

    const userPrompts: FilledPrompt[] = [
        { prompt: "What is your favorite hobby?", answer: "Reading books" },
        { prompt: "Describe your ideal weekend.", answer: "Hiking and relaxing by the beach." }
    ];

    const base64Images: string[] = [
        "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAA...", 
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
    ];

    const userData: UserData = {
        profile: userProfile,
        preferences: userPreferences,
        images: base64Images,
        prompts_filled: userPrompts
    };
    console.log("User Data:", JSON.stringify(userData, null, 2));
}

testUserData();
