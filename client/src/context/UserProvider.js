import React, {useState,} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'


export const UserContext = React.createContext()

const userAxios = axios.create()

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem("token")
    config.headers.Authorization = `Bearer ${token}`
    return config
})


export default function UserProvider(props){
    const {_id} = useParams()
    const initState = {
        user: JSON.parse(localStorage.getItem("user")) || {},
        token: localStorage.getItem("token") || "",
        issues:[],
        errMsg:"",
}

    const [userState, setUserState] = useState(initState)
    const [issueComments , setIssueComments] = useState([])
    const initInput = {comment:" "}
    const [inputs , setInputs] = useState({initInput})
    const [showComments, setShowComments] = useState(false)
    const [allUsers, setAllUsers] = useState([])
    const [allIssues, setAllIssues] = useState([])

    function signup(credentials){
        axios.post("/auth/signup", credentials)
        .then(res => {
            const { user, token } = res.data
            localStorage.setItem("token", token)
            localStorage.setItem("user", JSON.stringify(user))
            setUserState(prevUserState => ({
                ...prevUserState,
                user,
                token
              }))
        })
        .catch(err => handleAuthErr(err.response.data.errMsg))
    }

    function login(credentials){
        axios.post("/auth/login", credentials)
        .then(res => {
            const { user, token } = res.data
            localStorage.setItem("token", token)
            localStorage.setItem("user", JSON.stringify(user))
            getUserIssues()
            setUserState(prevUserState => ({
                ...prevUserState,
                user,
                token
              }))
        })
        .catch(err => handleAuthErr(err.response.data.errMsg))
    }

    function logout(){
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setUserState({
        user: {},
        token: "",
        issues: []
      })
    }

    function handleAuthErr(errMsg){
        setUserState(prevState =>({
            ...prevState,
            errMsg
        }))
    }

    function resetAuthErr(){
        setUserState(prevState =>({
            ...prevState,
            errMsg: ""
        }))
    }

    function getAllIssues(){
        userAxios.get('/api/issues')
        .then(res => setAllIssues(res.data))
        .catch(err => console.log(err.res.data.errMsg))
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

    function addIssue(newIssue){
        userAxios.post("/api/issues", newIssue)
        .then(res => {
            setUserState(prevState =>({
                ...prevState,
                issues: [...prevState.issues, res.data]
            }))
        })
        .catch(err => console.log(err.response.data.errMsg))
    }

    function addComment(issueId, newComment){
        userAxios.post(`/api/issues/comments/${issueId}/comments`, newComment)
        .then(res => setIssueComments(prevState => [...prevState, res.data]))
        .catch(err => console.log(err.response.data.errMsg))
    }

    function deleteIssue(issueId){
        userAxios.delete(`/api/issues/${issueId}`)
        .then(res =>  setUserState(prevState =>({
            ...prevState,
            issues: prevState.issues.filter(issue => issue._id !== issueId)
            
        })))
        .catch(err => console.log(err))
    }

    function update(issueId, issueEdit){
        userAxios.put(`/api/issues/comments/${issueId}/comments`)
        .then( res =>{
         setUserState(prevState => prevState.issues.map(issue => issue.id !== issueId? issue:issueEdit))
        })
        .catch(err => console.log(err))
    
    }

    function getNewComments(issueId){
        userAxios.get(`/api/issues/comments/${issueId}/comments`)
        .then(res => setIssueComments(res.data))
        .catch(err => console.log(err.response.data.errMsg))
    }
    // function deleteComments(commentId){
    //     userAxios.delete(`/comments/${commentId}`)
    //     .then(res => {
    //         setIssueComments(prevComments => prevComments.filter(comment => comment._id !== commentId) )
    //     })
    //     .catch(err => console.log(err))
    // }

    function submitComments(e){
        e.preventDefault()
        addComment(_id, inputs)
        setInputs({comment:""})
    }
     function onChange(e){
        const {name, value} = e.target
        setInputs(prevState => ({...prevState, [name]: value}))
     }

    function getAllUsers(){
        userAxios.get('/api/user')
        .then(res => setAllUsers(res.data))
        .catch(err => console.log(err.res.data.errMsg))
    }
    return(
        <UserContext.Provider
        value={{
            ...userState,
            signup,
            login,
            logout,
            addIssue,
            resetAuthErr,
            addComment,
            onChange,
            getNewComments,
            submitComments,
            getUserIssues,
            userAxios,
            getAllUsers,
            allIssues,
            getAllIssues,
            allUsers,
            deleteIssue,
            update

        }}>
            {props.children}
        </UserContext.Provider>
    )
}