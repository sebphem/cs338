import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Container, Form, Button, Card, Spinner } from 'react-bootstrap';

function ConversationalInterface() {
    const { state } = useLocation(); 
    const history = useHistory();

    const isMounted = useRef(true);

    const [userInput, setUserInput] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [isProceedLoading, setIsProceedLoading] = useState(false);
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
        setIsChatLoading(true);
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
            if (isMounted.current) setIsChatLoading(false);
        }
    };

    const handleProceed = async () => {
        setIsProceedLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/step-one-prompts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profile: userProfile })
            });

            const data = await response.json();
            if (response.ok) {
                history.push('/image-upload', { profile: userProfile, prompts: data.prompts });
            }
        } catch (error) {
            console.error('Error during proceed:', error);
        } finally {
            setIsProceedLoading(false);
        }
    };

    return (
        <Container className="mt-5">
            <Card className="p-4 shadow-lg">
                <h1 className="text-center mb-4">✨ AI-Powered Profile Enhancement ✨</h1>
                <p className="text-center text-muted">Chat with our AI to refine your profile before finalizing!</p>
            </Card>

            <Card className="p-3 mt-4">
                <h4>💬 Conversation</h4>
                <p className="text-muted">Try elaborating a little on yourself in the chat.</p>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {chatHistory.map((msg, index) => (
                        <p key={index}><strong>{msg.role}:</strong> {msg.text}</p>
                    ))}
                </div>
                <Form.Group className="mt-3">
                    <Form.Control 
                        type="text"
                        value={userInput} 
                        onChange={handleUserInput} 
                        disabled={isChatLoading}
                        placeholder="Ask something or edit your profile..."
                    />
                </Form.Group>
                <div className="text-center mt-4">
                    <Button 
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={isChatLoading}
                        className="me-2"
                    >
                        {isChatLoading ? <Spinner size="sm" animation="border" /> : "Send"}
                    </Button>
                    <Button 
                        variant="success"
                        onClick={handleProceed}
                        disabled={isProceedLoading}
                    >
                        {isProceedLoading ? <Spinner size="sm" animation="border" /> : "Proceed to Image Upload"}
                    </Button>
                </div>
            </Card>

            <Card className="p-4 mt-4 shadow-lg">
                <h4>Profile Information</h4>
                <p className="text-muted">Information our AI has gathered from you.</p>
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
            </Card>
        </Container>
    );
}

export default ConversationalInterface;