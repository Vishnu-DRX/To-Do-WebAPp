import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReducer } from 'react';
import axios from "axios";
import './Home.css';
import Profile from './Profile';
import Task from './Task.js';

function reducer(state, action) {
  if(action.type=="increment")
  {Profile.setTaskcount((state)+1);}

  if(action.type=="decrement")
  {Profile.setTaskcount(state-1);}

  switch (action.type) {
    case "increment":
      return state+1;
    case "decrement":
      return state-1;
    default:
      return state
  }
}

function Home() {
  const [user, setUser] = useState({ id: Profile.getId(), username: Profile.getUsername() });
  const [tasks, setTasks] = useState([]);
  const tcount= parseInt(Profile.getTaskcount());
  const [tasksDone, dispatch] = useReducer(reducer,tcount);
  const navigate = useNavigate();

  console.log(user.id);
  console.log(user.username);
  console.log(tasks);


  useEffect(() => {
    var idcheck = Profile.getId();
    if (idcheck === 'null' || idcheck === null) {
      Profile.clearProfile();
      window.location.reload();
      navigate("/Login");
    }
    else {
      const fetchTasks = async () => {
        try {
          const result = await Profile.getTasks();
          setTasks(result);
        } catch (error) { console.error('Error fetching task list:', error); }
      };
      fetchTasks();
      //Profile.setTaskcount(0);
    }
  }, []);

  function signout() {
    Profile.clearProfile();
    window.location.reload();
    navigate("/Login");
  }

  function addTask(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    if (formData.get("taskname") === '') { return; }
    formData.append("id", user.id);

    axios.post(`http://localhost:8000/addtask`, formData)
      .then(res => {
        console.log(res.data);
      })
      .catch(function (error) { if (error.response) { console.log(error.response.data); } });
    window.location.reload()
  }

  

  return (
    <div className="Home">

      <div className="Home-header">

        <div className="addTask">
          <form method="post" onSubmit={addTask} encType="multipart/form-data">
            <label className="taskname">
              Add a new task
            </label>{' '}
            <input name="taskname" />{' '}
            <button className="Button3" type='button' ><label htmlFor="file-upload" >Upload Task File</label></button>
            <input id='file-upload' type="file" name='file'></input>{" "}
            <button className="Button2">Add</button>
          </form>
        </div>

        <label className='username'>{user.username}</label>
        <div className='Buttonbox2'><button className="Button2" onClick={signout}>Sign out</button></div>
      </div>
      <br></br><br></br>

      <div className='dashboard'>
        <h2>Dashboard</h2>
        <hr></hr><h4>
        <div style={{ display: 'inline' }}>Total Tasks: {tasks.length}</div>
        <div style={{ display: 'inline' ,paddingLeft:'60px'}}>Tasks Left: {tasks.length-tasksDone}</div>
        <div style={{ display: 'inline' ,paddingLeft:'60px'}}>Tasks Completed: {tasksDone}</div></h4>
      </div>

      <div className='tasklist'>
        <h2>Task List</h2>
        <hr></hr>
        <ul>
          {tasks.map((item) => (
            <li key={item._id}>
              <Task task={item} dispatch={dispatch}/>
              <hr></hr>
            </li>
          ))}
        </ul>
      </div>

    </div>


  )
};

export default Home;