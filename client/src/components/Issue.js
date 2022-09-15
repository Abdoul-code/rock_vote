import React, {useState, useContext, useEffect} from 'react'
import { UserContext } from '../context/UserProvider'


export default function Issue(props){
    const initState = {
        user: JSON.parse(localStorage.getItem("user")) || {},
        token: localStorage.getItem("token") || "",
        issues:[],
        errMsg:"",
}
const {comment, user } = useContext(UserContext)

const initInputs = {
    title: "",
    description: "",
    imgUrl: "",
    comment:" "
  }
    const [userState, setUserState] = useState(initState)
    const [allUsers, setAllUsers] = useState([])
    const {userAxios } = useContext(UserContext)
    const [issueComments, setIssueComments] = useState([])
    const [inputs, setInputs] = useState({ comment : "" })
    const {title , description, imgUrl, _id } = props


    useEffect(() => {
        getNewComments(_id)
        getUserIssues(_id) 
}, [])

function onChange(e){
    const {name, value} =e.target
    setInputs(prevState => ({...prevState, [name]: value}))
}
function addComment(issueId, newComment){
    userAxios.post(`/api/issues/comments/${issueId}/comments`, newComment)
    .then(res => setIssueComments(prevState => [...prevState, res.data]))
    .catch(err => console.log(err.response.data.errMsg))
}
function submitComments(e){
    e.preventDefault()
    addComment(_id, inputs)
    setInputs(initInputs)
}

function getNewComments(issueId){
    userAxios.get(`/api/issues/comments/${issueId}/comments`)
    .then(res => setIssueComments(res.data))
    .catch(err => console.log(err.response.data.errMsg))
}


function getUserIssues(){
    userAxios.get("/api/issues/user")
    .then(res =>{
        setUserState(prevState => ({
            ...prevState,
            issues:res.data
        }))
    })
    .catch(err => console.log(err.response.data.errMsg))
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
                      } else {
                          alert("you can't delete this comment")
                      }
                  }}>Delete Comment</button>
                  </div>
          })}                
              
          </div>
                        <form onSubmit={submitComments}>
                    <input 
                    onChange={onChange}
                    name='comment'
                    type="text"
                    value={inputs.comment}
                    placeholder="Enter your comment" />
                    <button>Submit</button>
                    
                </form>
     </>
    )
}