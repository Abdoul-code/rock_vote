import React, {useContext, useEffect} from 'react'
import IssueForm from './IssueForm.js'
import IssueList from './IssueList.js'
import { UserContext } from '../context/UserProvider.js'


export default function Profile(){
    const
     { getUserIssues,
        user: {
        username
        },
        addIssue,
        addComment,
        comments,
        issues,
        
    } = useContext(UserContext)
   
    useEffect(()=>{
        getUserIssues()
    },[])
    return(
        <div className='profile'>
            <h1>Welcome @{username}!</h1>
            <h3>Add A Issue</h3>
            <IssueForm addIssue={addIssue} addComment = {addComment}/>
            <h3>Your Issues</h3>
            <IssueList issues={issues} username = {username}/>
        </div>
    )

}