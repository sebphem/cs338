import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Container, Form, Button, Card, Spinner } from 'react-bootstrap';

function ConversationalInterface() {
    const { state } = useLocation(); 
    const history = useHistory();

    const isMounted = useRef(true);

    const [userInput, setUserInput] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userProfile, setUserProfile] = useState(state?.profile || {}); // Default profile from previous page

    useEffect(() => {
        isMounted.current = true;

        if (!userProfile || Object.keys(userProfile).length === 0) {
            history.push('/');
        }

        return () => {
            isMounted.current = false; // Cleanup on unmount
        };
    }, [userProfile, history]);

    // Handle user chat input
    const handleUserInput = (event) => {
        setUserInput(event.target.value);
    };

    // Handle user edits to the profile fields
    const handleProfileChange = (event) => {
        const { name, value } = event.target;
        setUserProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    // Send chat message
    const handleSubmit = async () => {
        setIsLoading(true);
        const historyText = chatHistory.length > 0 
            ? chatHistory.map(item => `${item.role}: ${item.text}`).join('\n') 
            : "No conversation history.";

        try {
            const response = await fetch('http://127.0.0.1:8000/convo_answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    profile: userProfile,
                    history: historyText,
                    user_answer: userInput
                })
            });

            const data = await response.json();
            if (response.ok && isMounted.current) {
                setChatHistory(prev => [...prev, { role: 'You', text: userInput }, { role: 'Bot', text: data.response }]);
                setUserProfile(data.profile); // Update profile with AI insights
                setUserInput('');
            } 
        } catch (error) {
            console.error('Error:', error);
        } finally {
            if (isMounted.current) setIsLoading(false);
        }
    };

    // Proceed to results page
    const handleQuit = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/step-one-prompts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profile: userProfile })
            });

            const data = await response.json();
            if (response.ok) {
                const bestPictureInfo = JSON.parse(localStorage.getItem('bestPictureInfo')); // Retrieve stored images
                console.log("retrieved best pic", bestPictureInfo);

                history.push('/results', { 
                    prompts: data.prompts, 
                    profile: data.profile,
                    bestPicture: bestPictureInfo 
                });
            }
        } catch (error) {
            console.error('Error during quit:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="mt-5">
            <Card className="p-4 shadow-lg">
                <h1 className="text-center mb-4">✨ AI-Powered Profile Enhancement ✨</h1>
                <p className="text-center text-muted">
                    Chat with our AI to refine your profile before finalizing!
                </p>

                {/* Editable Profile Fields */}
                <Form>
                    {Object.entries(userProfile).map(([key, value]) => (
                        <Form.Group key={key} className="mb-3">
                            <Form.Label className="text-capitalize">{key.replace(/_/g, ' ')}</Form.Label>
                            <Form.Control 
                                type="text"
                                name={key}
                                value={value || ''}
                                onChange={handleProfileChange}
                                placeholder={`Enter ${key.replace(/_/g, ' ')}`}
                            />
                        </Form.Group>
                    ))}
                </Form>

                {/* Chat History */}
                <Card className="p-3 mt-4">
                    <h4>💬 Conversation</h4>
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {chatHistory.map((msg, index) => (
                            <p key={index}><strong>{msg.role}:</strong> {msg.text}</p>
                        ))}
                    </div>
                </Card>

                {/* Chat Input */}
                <Form.Group className="mt-3">
                    <Form.Control 
                        type="text"
                        value={userInput} 
                        onChange={handleUserInput} 
                        disabled={isLoading} 
                        placeholder="Ask something or edit your profile..."
                    />
                </Form.Group>

                {/* Buttons */}
                <div className="text-center mt-4">
                    <Button 
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="me-2"
                    >
                        {isLoading ? <Spinner size="sm" animation="border" /> : "Send"}
                    </Button>
                    <Button 
                        variant="danger"
                        onClick={handleQuit}
                        disabled={isLoading}
                    >
                        {isLoading ? <Spinner size="sm" animation="border" /> : "Finalize Profile"}
                    </Button>
                </div>
            </Card>
        </Container>
    );
}

export default ConversationalInterface;


// import React, { useState, useEffect } from 'react';
// import { useLocation, useHistory } from 'react-router-dom';

// function ConversationalInterface() {
//     const { state } = useLocation(); // Access the state from the previous page (RedditProfilePage)
//     const [userInput, setUserInput] = useState('');
//     const [chatHistory, setChatHistory] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [userProfile, setUserProfile] = useState(state ? state.profile : {}); // Default to the profile passed from RedditProfilePage
//     const history = useHistory();

//     useEffect(() => {
//         if (!userProfile) {
//             // If no profile was passed, redirect back to the RedditProfilePage
//             history.push('/');
//         }
//     }, [userProfile, history]);

//     const handleUserInput = (event) => {
//         setUserInput(event.target.value);
//     };

//     const handleSubmit = async () => {
//         setIsLoading(true);
//         const historyText = chatHistory.length > 0 
//             ? chatHistory.map(item => `${item.role}: ${item.text}`).join('\n') 
//             : "No conversation history.";

//         try {
//             const response = await fetch('http://127.0.0.1:8000/convo_answer', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     profile: userProfile,
//                     history: historyText,
//                     user_answer: userInput
//                 })
//             });
//             const data = await response.json();
//             if (response.ok) {
//                 setChatHistory(prev => [...prev, { role: 'You', text: userInput }, { role: 'Bot', text: data.response }]);
//                 setUserProfile(data.profile);
//                 setUserInput('');
//             } else {
//                 console.error('Failed to fetch prompts:', data.error);
//             }
//         } catch (error) {
//             console.error('Error:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleQuit = async () => {
//         setIsLoading(true);
//         try {
//             const response = await fetch('http://127.0.0.1:8000/step-one-prompts', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     profile: userProfile
//                 })
//             });
//             const data = await response.json();
//             if (response.ok) {
//                 history.push('/results', { prompts: data.prompts, profile: data.profile });
//             } else {
//                 console.error('Failed to fetch prompts:', data.error);
//             }
//         } catch (error) {
//             console.error('Error during quit:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div>
//             <div>
//                 {chatHistory.map((msg, index) => (
//                     <p key={index}><strong>{msg.role}:</strong> {msg.text}</p>
//                 ))}
//             </div>
//             <input 
//                 value={userInput} 
//                 onChange={handleUserInput} 
//                 disabled={isLoading} 
//                 placeholder="Type your message here..."
//             />
//             <button onClick={handleSubmit} disabled={isLoading}>Send</button>
//             <button onClick={handleQuit} disabled={isLoading}>Quit</button>
//         </div>
//     );
// }

// export default ConversationalInterface;
