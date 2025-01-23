import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

function SearchForm() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        alert(`Searching for: ${firstName} ${lastName}`);
        // Add the API call or processing logic here
    };

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter first name"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter last name"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                        />
                    </Form.Group>
                </Row>

                <Button variant="primary" type="submit">
                    Search
                </Button>
            </Form>
        </Container>
    );
}

export default SearchForm;
