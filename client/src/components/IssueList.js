import React from 'react'
import Issue from './Issue.js'


export default function IssueList(props){
    const {issues,comment} = props
    return(
        <div className='issue-list'>
            {issues.map(issue => <Issue {...issue} key={issue._id} comment={comment} />)}
            
        </div>
    )
}