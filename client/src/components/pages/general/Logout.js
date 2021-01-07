import React,{useEffect, useState} from 'react'
import useToken from './useToken'
import axios from 'axios'
import { useHistory,Redirect } from 'react-router-dom';
import ReactLoading from 'react-loading'
import { usePromiseTracker,trackPromise } from "react-promise-tracker";
async function handleLogout (token) { axios.post('http://localhost:5000/api/staffs/logout',{},
        {
            headers: {
                'auth-token': `${token}`
            }
        }).then(async (res) => {
            sessionStorage.removeItem('token')
            console.log(res.data)
            
          })
          .catch((error) => {
            console.error(error)
            console.log("yep cock")
          })
        }
export default function  Logout  ({setTokeypokey}) {
    const token = useToken().token
    const history = useHistory()
    const Load = ({ type, color }) => (
        <ReactLoading type={type} color={color} height={667} width={375} />
    );
    const LoadingIndicator = props => {
        const { promiseInProgress } = usePromiseTracker();
          return (
            promiseInProgress && 
            <div style={{padding:'100px',marginLeft:'30%'}}>
            <Load type='balls' color='#0C0A4A' /></div>
         );  
         }
       useEffect(async ()=>{
        try{
            await handleLogout(token)
            await setTokeypokey(false);
            history.push("/");
            }
            catch (er) {
                alert(er.message);
              }
       })
        

    return(<><LoadingIndicator/></>)
}