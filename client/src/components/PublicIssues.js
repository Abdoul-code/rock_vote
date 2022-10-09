import React,{useContext, useState, useEffect} from 'react'
import { UserContext } from '../context/UserProvider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons'

export default function PublicIssues(props){
    const { author, title, description, datePosted,imgUrl, _id, username, upvotes, downvotes} = props

    const {userAxios, getUserIssues, user, allUsers} = useContext(UserContext)
    const [issueComments, setIssueComments] = useState([])
    const [showComments , setShowComments] = useState(false)
    const initInputs = {comment: ''}

    const [inputs, setInputs] = useState({ initInputs})
    const [upvotesCount, setUpvotesCount] = useState(upvotes)
    const [downvotesCount, setDownvotesCount] = useState(downvotes)

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
        userAxios.put(`/api/issues/upvote/${_id}`)
        .then( res => {
            console.log(res)
            setUpvotesCount(res.data.upvotes)
            setDownvotesCount(res.data.downvotes)
        })
        .catch(err => console.log(err))
    }
    

    function handleDownVote(_id){
       
        userAxios.put(`/api/issues/downvote/${_id}`)
        .then( res => {
            setDownvotesCount(res.data.downvotes)
            setUpvotesCount(res.data.upvotes)
        } )
    .catch(err => console.log(err))
    }

    useEffect(() => {
        getNewComments(_id)
        getUserIssues(_id) 
}, [])

return (
    <div className='issue-container'>
        <div className='publicIssue'>
            <h2>{allUsers.find(u => u._id === author)?.username} {title}</h2>
            <h2>{description}</h2>
            <img src={imgUrl} alt={imgUrl} width={270} height = {300}/>
            <h3>posted on {new Date(datePosted).toLocaleDateString()}</h3>
            <div className='upDown_container'>
            <h1 className='like-container'><FontAwesomeIcon onClick={() => handleUpvote(_id)}  className="like-icon" icon={faThumbsUp} size="lg"/>{`${upvotesCount?.length}`}</h1> 
            <h1 className='dislike-container'><FontAwesomeIcon onClick={() => handleDownVote(_id)} className="dislike-icon" icon={faThumbsDown} size="lg"/>{`${downvotesCount?.length}`}</h1> 
            </div>
            {!showComments ?
             <button className="comment-button" onClick={() => setShowComments(!showComments)}>show</button>:
             <button className="comment-button" onClick={() => setShowComments(!showComments)}>hide</button>}
             {showComments ? <div>
                {issueComments.map(comment => {
                  return <div key={comment._id} className="public-comment">
                    <small className='public-comment-user'>
                        {allUsers.find(u => u._id === comment.user.username)}
                    </small>
                    <p>{comment.comment}</p>
                    <button className="delete-button"onClick={()=> {
                        console.log("delete button was clicked with this id:", comment._id)
                        if(user._id === comment.user){
                                userAxios.delete(`api/issues/comments/${_id}/comments/${comment._id}`)
                                .then(res => {
                                    getNewComments(_id)
                                    alert(`Successfully deleted the comment`)
                                })
                                .catch(err => console.log("Delete fn err: ",err))
                        } else {
                            alert("you can't delete this comment")
                        }
                    }}>Delete </button>
             </div>
              })}
             <form onSubmit={submitComments}>
                <input 
                    onChange={onChange}
                    name='comment'
                    type="text"
                    value={inputs.comment}
                    placeholder="add-comment" />
                    <button>Send</button>  
                </form>
                </div>:null}
    </div>
    </div>
)
}