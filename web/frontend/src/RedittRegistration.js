import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';

function RedditProfilePage() {
    const [redditUsername, setRedditUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const history = useHistory();

    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    const handleUsernameChange = (event) => {
        setRedditUsername(event.target.value);
    };

    const handleSubmit = async () => {
        if (!redditUsername) {
            setError('Please enter a Reddit username.');
            return;
        }
        
        setIsLoading(true);
        setError('');

        try {
            // Step 1: Fetch Reddit Profile
            const profileResponse = await fetch('http://127.0.0.1:8000/redditprofilescrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: redditUsername })
            });

            const profileData = await profileResponse.json();

            if (!profileResponse.ok || profileData.response === "rip bozo") {
                if (isMounted.current) setError('Username not found. Please enter a different username.');
                setIsLoading(false); // Ensure loading state is reset
                return;
            }
            console.log("Profile Data:", profileData);

            const structuredProfile = {};
            profileData.response.split("\n").forEach(line => {
                const [key, value] = line.split(": ");
                if (key) structuredProfile[key.trim()] = value?.trim() || "";
            });

            console.log("structured profile", structuredProfile);

            // Step 4: Redirect to ResultsPage
            if (isMounted.current) {
                history.push('/chat', { 
                    profile: structuredProfile
                });
            }

        } catch (error) {
            if (isMounted.current) setError('An error occurred while fetching the Reddit profile.');
            // setError('An error occurred while fetching the Reddit profile.');
            console.error('Error:', error);
        } finally {
            if (isMounted.current) setIsLoading(false);
            //setIsLoading(false);
        }
    };

    return (
        <Container className="mt-5">
            <Card className="p-4 shadow-lg">
                <h1 className="text-center mb-4">Reddit Profile Scraper</h1>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form.Group>
                    <Form.Label><strong>Reddit Username</strong></Form.Label>
                    <Form.Control 
                        type="text"
                        placeholder="Enter your Reddit username"
                        value={redditUsername}
                        onChange={handleUsernameChange}
                        disabled={isLoading}
                    />
                </Form.Group>
                <div className="text-center mt-4">
                    <Button 
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-100"
                    >
                        {isLoading ? "Processing..." : "Generate Profile"}
                    </Button>
                </div>
            </Card>
        </Container>
    );
}

export default RedditProfilePage;