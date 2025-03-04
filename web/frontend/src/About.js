import React from 'react';
import { Container, Card } from 'react-bootstrap';

export default function About() {
    return (
        <Container className="mt-5">
            <Card>
                <Card.Body>
                    <h1>About Cupidity</h1>
                    <p>
                        Welcome to <strong>Cupidity</strong>, a platform designed to help you design the perfect dating profile.
                        Our mission is to help you show the best version of yourself and attract the person of your dreams.
                    </p>
                    
                    <h3>Why Choose Us?</h3>
                    <ul>
                        <li>✅ Smart image selection system</li>
                        <li>✅ Optimizing prompt selection and answers </li>
                        <li>✅ AI-powered image enhancement</li>
                    </ul>

                    <h3>Our Story</h3>
                    <p>
                        Founded in 2025, Cupidity was built to redefine online dating by helping users present the best versions of themselves.
                    </p>
                    
                    <h3>Get Started</h3>
                    <p>
                        Ready to find your match? <a href="/">Sign up today!</a>
                    </p>
                </Card.Body>
            </Card>
        </Container>
    );
}
