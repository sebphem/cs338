import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, ListGroup } from 'react-bootstrap';

function ResultsPage() {
    const location = useLocation();
    const [prompts, setPrompts] = useState([]);

    useEffect(() => {
        // Check if there is any data passed to the location state
        const promptString = location.state?.prompts; // Assuming prompts is a string as described
        if (promptString) {
            // Regular expression to find all instances of text within double quotes
            const matches = promptString.match(/"([^"]*)"/g);
            if (matches) {
                // Remove the quotes from each prompt and store in state
                setPrompts(matches.map(match => match.replace(/"/g, '')));
            }
        }
    }, [location]);

    return (
        <Container>
            <h1 className="text-center">Your Suggested Prompts</h1>
            {prompts.length > 0 ? (
                <ListGroup className="mt-5">
                    {prompts.map((prompt, index) => (
                        <ListGroup.Item key={index}>{prompt}</ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                <div className="alert alert-warning" role="alert">
                    No prompts available. Please try again.
                </div>
            )}
        </Container>
    );
}

export default ResultsPage;
