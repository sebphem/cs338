import React from 'react';
import { Container, Card } from 'react-bootstrap';

export default function About() {
    return (
        <Container className="mt-5">
            <Card>
                <Card.Body>
                    <h1>About Cupidity</h1>
                    <p>
                        Welcome to <strong>Cupidity</strong>, a platform designed to bring meaningful connections to life.
                        Our mission is to help you find like-minded individuals based on shared interests and values.
                    </p>
                    
                    <h3>Why Choose Us?</h3>
                    <ul>
                        <li>✅ Smart matching system</li>
                        <li>✅ User-friendly experience</li>
                        <li>✅ Genuine connections</li>
                    </ul>

                    <h3>Our Story</h3>
                    <p>
                        Founded in 2025, Cupidity was built to redefine online dating by focusing on real personalities and meaningful conversations.
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
