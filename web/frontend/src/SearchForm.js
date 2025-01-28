import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, InputGroup } from 'react-bootstrap';

function SearchForm() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [socialMedia, setSocialMedia] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!firstName || !lastName) {
            alert('Please enter both first and last names.');
            return;
        }
        alert(`Searching for: ${firstName} ${lastName}`);
        // Add the API call or processing logic here
    };

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridFirstName">
                        <Form.Label>First Name <span className="required-asterisk">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter first name"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridLastName">
                        <Form.Label>Last Name <span className="required-asterisk">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter last name"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridPhoneNumber">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter phone number"
                            value={phoneNumber}
                            onChange={e => setPhoneNumber(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col}>
                        <Form.Label>Social Media</Form.Label>
                        <InputGroup>
                        <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Username"
                                value={socialMedia}
                                onChange={e => setSocialMedia(e.target.value)}
                            />
                        </InputGroup>
                    </Form.Group>
                </Row>

                <Button variant="secondary" type="submit">
                    Search
                </Button>
            </Form>
        </Container>
    );
}

export default SearchForm;
