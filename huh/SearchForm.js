import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function SearchForm() {
    const history = useHistory();
    const [profile, setProfile] = useState({
        name: '',
        age: 0,
        height: 0,
        location: '',
        dating_intentions: [],
        relationship_type: [],
        ethnicity: [],
        children: '',
        family_plans: '',
        covid_vaccine: false,
        pets: '',
        zodiac: '',
        work: '',
        job_title: '',
        preferences: '',
        school: '',
        education: '',
        religious_beliefs: '',
        hometown: '',
        politics: '',
        languages: [],
        drinking: '',
        smoking: false,
        weed: false,
        drugs: false,
    });

    // Handlers for profile and preferences inputs
    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    // Form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = { profile, preferences };
        try {
            const response = await axios.post('http://127.0.0.1:8000/step-one-prompts', data);
            history.push('/results', { state: { data: response.data } });
        } catch (error) {
            console.error('Error while fetching prompts:', error);
            alert('Failed to fetch prompts. Please try again.');
        }
    };

    // Simplified form for the example
    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleProfileChange}
                                placeholder="Enter name"
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formAge">
                            <Form.Label>Age</Form.Label>
                            <Form.Control
                                type="number"
                                name="age"
                                value={profile.age}
                                onChange={handleProfileChange}
                                placeholder="Enter age"
                            />
                        </Form.Group>
                    </Col>
                </Row>
                {/* Additional fields can be similarly added as needed */}
                <Button variant="primary" type="submit">Submit</Button>
            </Form>
        </Container>
    );
}

export default SearchForm;
