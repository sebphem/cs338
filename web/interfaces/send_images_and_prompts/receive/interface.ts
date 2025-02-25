import { Profile } from "../../send_user_info/send/interface";
interface PromptedImages{
    prompt?:string;
    image:string;
}

interface UserData{
    profile: Profile;
    prompts: string[];
    promptedimages:PromptedImages[];
}
