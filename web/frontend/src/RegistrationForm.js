import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Form, Button, Card, InputGroup } from 'react-bootstrap';

function RegistrationForm() {
    const history = useHistory();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        profile: {
            name: '',
            age: 18,
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
            school: '',
            education: '',
            religious_beliefs: '',
            hometown: '',
            politics: '',
            languages: [],
            drinking: '',
            smoking: false,
            weed: false,
            drugs: false
        },
        preferences: {
            max_distance: 0,
            age_range: [18, 100],
            relationship_type: [],
            height_range: [0, 300],
            dating_intentions: [],
            children: '',
            family_plans: '',
            vices: [],
            politics: '',
            education: ''
        }
    });

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        const [part, key] = name.split('.');
        if (type === 'checkbox') {
            setFormData(prevState => ({
                ...prevState,
                [part]: { ...prevState[part], [key]: checked }
            }));
        } else if (type === 'select-multiple') {
            const options = event.target.options;
            const values = [];
            for (let i = 0, l = options.length; i < l; i++) {
                if (options[i].selected) {
                    values.push(options[i].value);
                }
            }
            setFormData(prevState => ({
                ...prevState,
                [part]: { ...prevState[part], [key]: values }
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [part]: { ...prevState[part], [key]: value }
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (step < 3) {
            setStep(step + 1);
        } else {
            try {
                const response = await fetch('http://127.0.0.1:8000/step-one-prompts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const responseData = await response.json();
                if (response.ok) {
                    history.push('/results', { prompts: responseData.prompts });
                } else {
                    console.error('Failed to fetch prompts:', responseData.error);
                }
            } catch (error) {
                console.error("Error submitting form:", error);
            }
        }
    };

    return (
        <Container className="mt-5">
            <Card>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <>
                                <h4>First, the required fields...</h4>
                                <Form.Group>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" name="profile.name" value={formData.profile.name} onChange={handleInputChange} required />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Age</Form.Label>
                                    <Form.Control type="number" name="profile.age" value={formData.profile.age} onChange={handleInputChange} min="18" required />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Height</Form.Label>
                                    <InputGroup className="mb-3">
                                        <Form.Control type="number" name="profile.height" value={formData.profile.height} onChange={handleInputChange} required />
                                        <InputGroup.Text>cm</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                                <Button variant="primary" className="mt-3 mb-3" onClick={() => setStep(step + 1)}>Next</Button>
                            </>
                        )}
                        {step === 2 && (
                            <>
                                <h4>Now, tell us a little more about yourself (all optional but recommended)</h4>
                                <Form.Group>
                                    <Form.Label>Location</Form.Label>
                                    <Form.Control type="text" name="profile.location" value={formData.profile.location} onChange={handleInputChange} />
                                </Form.Group>
                                {/* <Form.Group>
                                    <Form.Label>Dating Intentions</Form.Label>
                                    <Form.Control type="text" name="profile.dating_intentions" value={formData.profile.dating_intentions} onChange={handleInputChange} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Relationship Type</Form.Label>
                                    <Form.Control type="text" name="profile.relationship_type" value={formData.profile.relationship_type} onChange={handleInputChange} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Ethnicity</Form.Label>
                                    <Form.Control type="text" name="profile.ethnicity" value={formData.profile.ethnicity} onChange={handleInputChange} />
                                </Form.Group> */}
                                <Form.Group>
                                    <Form.Label>Children</Form.Label>
                                    <Form.Control type="text" name="profile.children" value={formData.profile.children} onChange={handleInputChange} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Family Plans</Form.Label>
                                    <Form.Control type="text" name="profile.family_plans" value={formData.profile.family_plans} onChange={handleInputChange} />
                                </Form.Group>
                                {/* <Form.Group>
                                    <Form.Label>Covid Vaccine</Form.Label>
                                    <Form.Control type="text" name="profile.covid_vaccine" value={formData.profile.covid_vaccine} onChange={handleInputChange} />
                                </Form.Group> */}
                                <Form.Group>
                                    <Form.Label>Pets</Form.Label>
                                    <Form.Control type="text" name="profile.pets" value={formData.profile.pets} onChange={handleInputChange} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Zodiac</Form.Label>
                                    <Form.Control type="text" name="profile.zodiac" value={formData.profile.zodiac} onChange={handleInputChange} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Work</Form.Label>
                                    <Form.Control type="text" name="profile.work" value={formData.profile.work} onChange={handleInputChange} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Job Title</Form.Label>
                                    <Form.Control type="text" name="profile.job_title" value={formData.profile.job_title} onChange={handleInputChange} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>School</Form.Label>
                                    <Form.Control type="text" name="profile.school" value={formData.profile.school} onChange={handleInputChange} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Education</Form.Label>
                                    <Form.Control type="text" name="profile.education" value={formData.profile.education} onChange={handleInputChange} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Religious Beliefs</Form.Label>
                                    <Form.Control type="text" name="profile.religious_beliefs" value={formData.profile.religious_beliefs} onChange={handleInputChange} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Home Town</Form.Label>
                                    <Form.Control type="text" name="profile.hometown" value={formData.profile.hometown} onChange={handleInputChange} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Politics</Form.Label>
                                    <Form.Control type="text" name="profile.politics" value={formData.profile.politics} onChange={handleInputChange} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Languages</Form.Label>
                                    <Form.Control type="text" name="profile.languages" value={formData.profile.languages} onChange={handleInputChange} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Drinking</Form.Label>
                                    <Form.Control type="text" name="profile.drinking" value={formData.profile.drinking} onChange={handleInputChange} />
                                </Form.Group>
                                {/* <Form.Group>
                                    <Form.Label>Smoking</Form.Label>
                                    <Form.Check 
                                        type="checkbox"
                                        label="Uses cigs"
                                        name="profile.smoking"
                                        id="profile.smoking"
                                        checked={formData.profile.smoking}
                                        onChange={handleInputChange}
                                        className="mb-3"
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Weed</Form.Label>
                                    <Form.Check 
                                        type="checkbox"
                                        label="Uses weed"
                                        name="profile.weed"
                                        id="profile.weed"
                                        checked={formData.profile.weed}
                                        onChange={handleInputChange}
                                        className="mb-3"
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Drugs</Form.Label>
                                    <Form.Check 
                                        type="checkbox"
                                        label="Uses recreational drugs"
                                        name="profile.drugs"
                                        id="profile.drugs"
                                        checked={formData.profile.drugs}
                                        onChange={handleInputChange}
                                        className="mb-3"
                                    />
                                </Form.Group> */}
                                <Button variant="primary" className="mt-3 mb-3" onClick={() => setStep(step + 1)}>Next</Button>
                            </>
                        )}
                        {step === 3 && (
                            <>
                                <h4>Finally, tell us about your preferences...to be developed</h4>
                                <Form.Group>
                                    <Form.Label>Max Distance</Form.Label>
                                    {/* <Form.Control type="number" name="preferences.max_distance" value={formData.preferences.max_distance} onChange={handleInputChange} /> */}
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Age Range</Form.Label>
                                    {/* <Form.Control type="text" placeholder="18-100" name="preferences.age_range" value={formData.preferences.age_range.join('-')} onChange={handleInputChange} /> */}
                                </Form.Group>
                                {/* Continue adding preference fields as needed */}
                                <Button type="submit" className="mt-3 mb-3" variant="success">Submit</Button>
                            </>
                        )}
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default RegistrationForm;
