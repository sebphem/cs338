import React from 'react';
import { Container, Card } from 'react-bootstrap';
import DatingProfileImage from "./DatingProfileImage.jpg"; 
import './ResultsImages.css';
import Nav from 'react-bootstrap/Nav';



export default function Contact() {
    return (
        <Container className="mt-5 d-flex justify-content-center vh-100">

        <Card className='iphone-container'>

        <Card className="iphone-simulation">

            <Card.Header className='d-flex justify-content-around'>                
                <Nav.Item className = 'card-header-styling'>
                    <Nav.Link href="#first"> Edit </Nav.Link>
                </Nav.Item>

                <Nav.Item className = 'card-header-styling'>
                    <Nav.Link href="#first"> View </Nav.Link>
                </Nav.Item>

            </Card.Header>

            

            <div>
                    <p className = "padding-pronouns">                    
                        You're using she/her/hers pronouns
                    </p>
                    </div>
                
                    
                    <div className = "image-container center">
                        <img src={DatingProfileImage} alt="Example" />
                    </div>
            
            <Card className="rounded-card prompts">
                <Card.Body >

                    Prompt 1
                    
                </Card.Body>
            </Card>

            <Card className="rounded-card prompts">
                <Card.Body >

                    Prompt 2
                    
                </Card.Body>
            </Card>

            <Card className="rounded-card prompts">
                <Card.Body >

                    Prompt 3
                    
                </Card.Body>
            </Card>


        </Card>

        </Card>
        </Container>
    );
}
