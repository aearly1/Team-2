import { Button } from 'react-bootstrap'
import React,{useEffect, useState} from 'react'
import useToken from './useToken'
import axios from 'axios'
import { useHistory } from 'react-router-dom';

export default function Logout () {
    const token = useToken().token
    let history = useHistory()
    
        axios.post('http://localhost:5000/api/staffs/logout',{},
        {
            headers: {
                'auth-token': `${token}`
            }
        }).then((res) => {
            sessionStorage.removeItem('token')
            console.log(res.data)
            history.push("/login");
          })
          .catch((error) => {
            console.error(error)
          })


    return(
        <div>
            <Button></Button>
        </div>
    )
}