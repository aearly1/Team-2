import React from 'react'
import {Container} from 'react-bootstrap'
const About = () => {
    return (
        <div>
            <h1>About This App:</h1>
            <p className="my-1">
                This is a full-stack React App for GUC Advanced Computer Lab Course, 
                Created by Team 2.
            </p>
            <p>
                <strong>Contributing Team 2 Members: </strong>
                <Container fluid className = "pl-5">    
                    <ul>
                        <li>{"Abdelrahman Diab  --  43-11809"}</li>
                        <li>{"Ali Elbadry  --  43-no one knows cuz he submits everything"}</li>
                        <li>{"Mayaaaaaar  --  43-6645"}</li>
                        <li>{"Mostafa Sohob  --  43-8530"}</li>
                        <li>{"Saeed Ashraf  --  43-8342"}</li>
                    </ul>
                </Container>
            </p>
        </div>
    )
}

export default About 