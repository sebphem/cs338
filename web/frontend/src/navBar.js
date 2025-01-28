import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

export default function NavBar() {
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="#home">UnIncognito</Navbar.Brand>
            </Container>
        </Navbar>
    );
}
