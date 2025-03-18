import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

function NextStep() {
    const history = useHistory();
    const location = useLocation();
    const profile = location.state?.profile || {};

    if (!profile) {
        return <h1>Error: No profile data found. Please go back and try again.</h1>;
    }

    const goToConversation = () => {
        history.push('/conversation', { profile });
    };

    const goToResults = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/step-one-prompts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profile })
            });

            const data = await response.json();
            if (response.ok) {
                history.push('/results', { prompts: data.prompts, profile: data.profile });
            } else {
                console.error('Error fetching prompts:', data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>Your Reddit Profile Summary</h1>
            <p>We analyzed your Reddit activity and created a dating profile.</p>
            <button onClick={goToConversation}>Refine with Chatbot</button>
            <button onClick={goToResults}>Proceed to Final Prompts</button>
        </div>
    );
}

export default NextStep;