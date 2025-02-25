import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import logo from './HeartLogo.webp'

export default function NavBar() {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href="/">
                    <img
                        src={logo}
                        alt="UnIncognito Logo"
                        width="40"
                        height="40"
                        className="d-inline-block align-top"    
                    />        
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/about">About</Nav.Link>
                        <Nav.Link href="/contact">Contact</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
