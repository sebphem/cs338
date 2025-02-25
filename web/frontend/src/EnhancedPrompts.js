import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';

function EnhancedPromptsPage() {
    const location = useLocation();
    const fleshedOutPrompts = location.state?.fleshedOutPrompts || "";

    return (
        <Container>
            <h1 className="text-center">Enhanced Prompts</h1>
            <Card className="mt-5">
                <Card.Body>
                    {/* Displaying fleshed out prompts as a single preformatted text block */}
                    <Card.Text as="pre" style={{ whiteSpace: 'pre-wrap' }}>
                        {fleshedOutPrompts}
                    </Card.Text>
                </Card.Body>
            </Card>
            {fleshedOutPrompts.length === 0 && (
                <div className="alert alert-warning" role="alert">
                    No enhanced prompts available. Please try again.
                </div>
            )}
        </Container>
    );
}

export default EnhancedPromptsPage;
