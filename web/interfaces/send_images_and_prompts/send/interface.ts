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
        images: base64Images,
        prompts_filled: userPrompts
    };
    console.log("User Data:", JSON.stringify(userData, null, 2));
}

testUserData();
