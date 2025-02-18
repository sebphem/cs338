import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';

function ResultsPage() {
    const location = useLocation();
    const [profileData, setProfileData] = useState([]);

    useEffect(() => {
        // Check if there is any data passed to the location state
        const data = location.state?.data;
        if (data) {
            setProfileData(data.prompts); // Adjust according to your actual data structure
            console.log("data fetched: ", data);
        }
    }, [location]);

    return (
        <Container>
            <h1 className="text-center">Profile Data</h1>
            <Row className="mt-5 justify-content-center">
                {profileData.length > 0 ? profileData.map((profile, index) => (
                    <Col md={8} key={index} className="mb-3">
                        <Card>
                            <Card.Header className="text-white bg-primary">
                                <h2 className="card-title">{profile.firstName} {profile.lastName}</h2>
                            </Card.Header>
                            <Row className="no-gutters">
                                <Col md={8}>
                                    <Card.Body>
                                        <p className="card-text"><strong>Birth Date:</strong> {profile.birthDate}</p>
                                        <p className="card-text"><strong>Gender:</strong> {profile.gender}</p>
                                        <p className="card-text"><strong>Height:</strong> {profile.height}</p>
                                        <p className="card-text"><strong>Weight:</strong> {profile.weight}</p>
                                    </Card.Body>
                                </Col>
                            </Row>
                            <Card.Footer className="bg-light">
                                <p className="text-muted">Summary: {profile.summary}</p>
                            </Card.Footer>
                        </Card>
                    </Col>
                )) : (
                    <Col>
                        <div className="alert alert-warning" role="alert">
                            No profiles found. Please try again.
                        </div>
                    </Col>
                )}
            </Row>
        </Container>
    );
}

export default ResultsPage;
