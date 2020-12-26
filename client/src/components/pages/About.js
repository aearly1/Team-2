import React from 'react'

const About = () => {
    return (
        <div>
            <h1>About This App:</h1>
            <p className="my-1">
                This is a full-stack React App for GUC Advanced Computer Lab Course, 
                Created by Team 2
            </p>
            <p>
                <strong>Contributing Team 2 Members: </strong>
                <div className = "p">    
                    <ul>
                    <li>{"Abdelrahman Diab  --  43-11809"}</li>
                    <li>{"Ali Elbadry  --  43-no one knows cuz he submits everything"}</li>
                    <li>{"Mayaaaaaar  --  43-6645"}</li>
                    <li>{"Mostafa Sohob  --  43-8530"}</li>
                    <li>{"Saeed Ashraf  --  43-8342"}</li>
                    </ul>
                </div>
            </p>
            <br/>
            <br/>
            <br/>
            <p className="bg-dark">
                <strong> &nbsp;&nbsp;Version: </strong>1.0.0
            </p>
        </div>
    )
}

export default About 