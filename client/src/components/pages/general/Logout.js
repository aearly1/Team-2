import React,{useEffect, useState} from 'react'
import useToken from './useToken'
import axios from 'axios'
import { useHistory } from 'react-router-dom';

export default function Logout ({setTokeypokey}) {
    const token = useToken().token
    let history = useHistory()
    
        axios.post('http://localhost:5000/api/staffs/logout',{},
        {
            headers: {
                'auth-token': `${token}`
            }
        }).then(async (res) => {
            try{
            sessionStorage.removeItem('token')
            await setTokeypokey(false);
            console.log(res.data)
            history.push("/login");
            }
            catch (er) {
                alert(er.message);
              }
          })
          .catch((error) => {
            console.error(error)
          })


    return(
        <div>
        </div>
    )
}