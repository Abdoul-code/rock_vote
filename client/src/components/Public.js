import React,{useContext, useEffect} from 'react'
import { UserContext } from '../context/UserProvider'
import PublicIssues from './PublicIssues.js'


export default function Public(){

    const {getAllIssues, allIssues, getAllUsers} = useContext(UserContext)

    const issueDisplay = allIssues.map(issue =>{
        return <PublicIssues key={issue._id} author={issue.user} {...issue}/>
    })
     
    useEffect(() =>{
        getAllIssues();
        getAllUsers();
    }, [])

    return(
        <div className='public'>
            {issueDisplay}

        </div>
    )
}