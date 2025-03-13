import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function ConversationalInterface() {
    const [userInput, setUserInput] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userProfile, setUserProfile] = useState({ preferences: 'i want a hot man' }); // Initial user preferences
    const history = useHistory();

    const handleUserInput = (event) => {
        setUserInput(event.target.value);
    };

    const handleSubmit = async () => {
        // event.preventDefault();
        setIsLoading(true);
        // const profile = { preferences: 'i want hot man'}; // adjust
        const historyText = chatHistory.length > 0 
            ? chatHistory.map(item => `${item.role}: ${item.text}`).join('\n') 
            : "No conversation history."
        try {
            const response = await fetch('http://127.0.0.1:8000/convo_answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                     profile: userProfile,
                     history: historyText,
                     user_answer: userInput
                })
            });
            const data = await response.json();
            console.log(data)
            if (response.ok) {
                setChatHistory(prev => [...prev, {role: 'You', text: userInput}, {role: 'Bot', text: data.response}]);
                setUserProfile(data.profile)
                setUserInput('');
            } else {
                console.error('Failed to fetch prompts:', data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuit = async () => {
        setIsLoading(true);
        try {
            // Calling 'step-one' instead of 'convo_answer'
            const response = await fetch('http://127.0.0.1:8000/step-one-prompts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    profile: userProfile
                })
            });
            const data = await response.json();
            if (response.ok) {
                // Assuming 'data.prompts' contains the array of prompts to be displayed on the ResultsPage
                console.log(data.prompts)
                history.push('/results', { prompts: data.prompts, profile: data.profile });
            } else {
                console.error('Failed to fetch prompts:', data.error);
            }
        } catch (error) {
            console.error('Error during quit:', error);
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <div>
            <div>
                {chatHistory.map((msg, index) => (
                    <p key={index}><strong>{msg.role}:</strong> {msg.text}</p>
                ))}
            </div>
            <input 
                value={userInput} 
                onChange={handleUserInput} 
                disabled={isLoading} 
                placeholder="Type your message here..."
            />
            <button onClick={handleSubmit} disabled={isLoading}>Send</button>
            <button onClick={handleQuit} disabled={isLoading}>Quit</button>
        </div>
    );
}

export default ConversationalInterface;