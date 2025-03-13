import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Container, ListGroup, Form, Button } from 'react-bootstrap';

function ResultsPage() {
    const location = useLocation();
    const history = useHistory();
    const [prompts, setPrompts] = useState([]);
    const [responses, setResponses] = useState({});
    // const [profile, setProfile] = useState({});

    useEffect(() => {
        console.log(location.state);
        const promptString = location.state?.prompts;
        if (promptString) {
            // Splitting the promptString by two newlines to separate each prompt
            const splitPrompts = promptString.split(/\n\n/);
            setPrompts(splitPrompts);

            // Creating initial responses object
            const initialResponses = splitPrompts.reduce((acc, prompt) => ({
                ...acc,
                [prompt]: '' // Initialize responses with empty strings
            }), {});
            setResponses(initialResponses);
        }
    }, [location]);
    

    const handleResponseChange = (prompt, value) => {
        setResponses(prev => ({ ...prev, [prompt]: value }));
    };

    const handleSubmit = async () => {
        const payload = {
            prompts: prompts,  // Directly use prompts if it's already an array
            prompt_answers: Object.values(responses),  // This should be an array of responses
            profile: location.state?.profile,
        };
    
        console.log("Submitting:", payload);  // Check what's being sent
    
        try {
            const response = await fetch('http://127.0.0.1:8000/step-two-prompts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const responseData = await response.json();
            if (response.ok) {
                history.push('/enhanced-prompts', {
                    fleshedOutPrompts: responseData.fleshed_out_prompts
                });
            } else {
                console.error('Failed to fetch enhanced prompts:', responseData.error);
            }
        } catch (error) {
            console.error("Error submitting responses:", error);
        }
    };
    

    return (
        <Container>
            <h1 className="text-center">Your Suggested Prompts</h1>
            <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <ListGroup className="mt-5">
                    {prompts.map((prompt, index) => (
                        <ListGroup.Item key={index}>
                            <Form.Group>
                                <Form.Label>{prompt}</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    value={responses[prompt] || ''} 
                                    onChange={(e) => handleResponseChange(prompt, e.target.value)} 
                                />
                            </Form.Group>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <Button type="submit" className="mt-3">Submit Responses</Button>
            </Form>
            {prompts.length === 0 && (
                <div className="alert alert-warning" role="alert">
                    No prompts available. Please try again.
                </div>
            )}
        </Container>
    );
}

export default ResultsPage;
