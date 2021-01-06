import React from 'react'
const About = () => {
    return (
        <div style={{textAlign:"center"}}>
            <h1>About This App:</h1>
            <p className="my-1">
                This is a MERN-stack App created for GUC Advanced Computer Lab Course Project, 
                Created by Team 2.
            </p>
            <p style ={{paddingTop:30}}>
                <strong style = {{fontSize:22}}>Contributing Team 2 Members: </strong>
                 
                    <ul style={{listStyleType:"none"}}>
                        <li>{"Abdelrahman Diab  --  43-11809"}</li>
                        <li>{"Ali Elbadry  --  43-6833"}</li>
                        <li>{"Mayaaaaaar  --  43-6645"}</li>
                        <li>{"Mostafa Sohob  --  43-8530"}</li>
                        <li>{"Saeed Ashraf  --  43-8342"}</li>
                    </ul>
            </p>
        </div>
    )
}

export default About 