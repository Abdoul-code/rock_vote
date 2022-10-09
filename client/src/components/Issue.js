import React, {useState, useContext, useEffect} from 'react'
import { UserContext } from '../context/UserProvider.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faThumbsUp} from '@fortawesome/free-solid-svg-icons'
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons'


export default function Issue(props){
    const initState = {
        user: JSON.parse(localStorage.getItem("user")) || {},
        token: localStorage.getItem("token") || "",
        issues:[],
        errMsg:"",
}
const { title, description,imgUrl, _id, username, upvotes, downvotes} = props
const {userAxios, getUserIssues, user, allUsers, deleteIssue } = useContext(UserContext)

const initInputs = {
    title: "",
    description: "",
    imgUrl: "",
  }

    const [userState, setUserState] = useState(initState)
    const [issueComments, setIssueComments] = useState([])
    const [inputs, setInputs] = useState({ comment : "" })
   

    const [upvotesCount, setUpvotesCount] = useState(upvotes.length)
    const [downvotesCount, setDownvotesCount] = useState(downvotes.length)
    
    function getNewComments(issueId){
        userAxios.get(`/api/issues/comments/${issueId}/comments`)
        .then(res => setIssueComments(res.data))
        .catch(err => console.log(err.response.data.errMsg))
    }

    function addComment(issueId, newComment){
        userAxios.post(`/api/issues/comments/${issueId}/comments`, newComment)
        .then(res => setIssueComments(prevState => [...prevState, res.data]))
        .catch(err => console.log(err.response.data.errMsg))
    }

    useEffect(() => {
        getNewComments(_id)
        getUserIssues(_id) 
}, [])

function onChange(e){
    const {name, value} =e.target
    setInputs(prevState => ({...prevState, [name]: value}))
}

function submitComments(e){
    e.preventDefault()
    addComment(_id, inputs)
    setInputs(initInputs)
}

function handleUpvote(_id){
    console.log("userId",user._id,"id",_id)
    if(_id !== user._id){
        userAxios.put(`/api/issues/upvote/${_id}`)
        .then( res => {
            setUpvotesCount(res.data.upvotes)
            setDownvotesCount(res.data.downvotes)
        })
        .catch(err => console.log(err))
    }
}

function handleDownVote(_id){
    if(_id !== user._id){
    userAxios.put(`/api/issues/downvote/${_id}`)
    .then( res => {
        setDownvotesCount(res.data.downvotes)
        setUpvotesCount(res.data.upvotes)
    } )

  .catch(err => console.log(err))
    }
}


function update(issueId, issueEdit){
    userAxios.put(`/api/issues/comments/${issueId}/comments`)
    .then( res =>{
     setUserState(prevState => prevState.issues.map(issue => issue.id !== issueId? issue:issueEdit))
    })
    .catch(err => console.log(err))

}


return(
      <>
        <div className='issue'>
 
            <div>
                <h1> {title} </h1>
                <h3> {description} </h3>
                <img src={imgUrl} alt={imgUrl} width={270} height = {300}/>
                    {issueComments.map(comment => <div>{comment.comment}</div>
                    )}
                    <div className='upDown_container'>
                  <h1 className='like-container'><FontAwesomeIcon onClick={() => handleUpvote(user._id)}  className="like-icon" icon={faThumbsUp} size="lg"/>{`${upvotesCount}`}</h1> 
                  <h1 className='dislike-container'><FontAwesomeIcon onClick={() => handleDownVote(user._id)} className="dislike-icon" icon={faThumbsDown} size="lg"/>{`${downvotesCount}`}</h1> 
                   </div>
                </div>

                {issueComments.map(comment => {
              return <div key={comment._id} className="public-comment">
                  <small className='public-comment-user'>{allUsers.find(u => u._id === comment.user.username)}</small>
                  <p>{comment.comment}</p><button className="delete-button"onClick={()=> {
                    console.log("delete button was clicked with this id:", comment._id)
                      if(user._id === comment.user){
                              userAxios.delete(`api/issues/comments/${_id}/comments/${comment._id}`)
                              .then(res => {
                                console.log("deelet fn response: ", res)
                                  getNewComments(_id)
                                  alert(`Successfully deleted the comment`)
                              })
                              .catch(err => console.log("Delete fn err: ",err))
                      } 
                      else {
                          alert("you can't delete this comment")
                      }
                  }}>Cancel</button>
                 
                  </div>
          })}                
              
                   <form onSubmit={submitComments}>
                    <input 
                    onChange={onChange}
                    name='comment'
                    type="text"
                    value={inputs.comment}
                    placeholder="Enter your comment" />
                    <button>Save Comment</button>   
                </form>
              <button onClick={() => deleteIssue(_id)}>Delete Issue</button>
          </div>
     </>
    )
}