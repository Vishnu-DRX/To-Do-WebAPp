import axios from "axios";
import { useState } from 'react';
import { useContext } from "react";
import { TaskContext } from "../App";
import Profile from './Profile';
import './Task.css';
//import { reducer } from "./Home";

function Task(taskobject) {
  const [user, setUser] = useState({ id: Profile.getId(), username: Profile.getUsername() });
  const [editbox, setEditbox] = useState(false);
  const taskSet = useContext(TaskContext);
  const task = taskobject.task;
  //console.log(task);

  function deleteTask() {
    var bod = { "id": user.id, "task": task };

    axios.post(`http://localhost:8000/deltask`, bod)
      .then(res => {
        console.log(res.data);
      })
      .catch(function (error) { if (error.response) { console.log(error.response.data); } });
    window.location.reload()
  }

  function handleEdit() {
    setEditbox(!(editbox));
  }

  function editTask(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    if (formData.get("taskname") === '') { return; }

    const oldtask = { taskname: task.taskname };
    const newtask = { taskname: formData.get("taskname") };
    var bod = { "id": user.id, "oldtask": oldtask, "newtask": newtask };

    axios.post(`http://localhost:8000/edittask`, bod)
      .then(res => {
        console.log(res.data);
      })
      .catch(function (error) { if (error.response) { console.log(error.response.data); } });

    setEditbox(false);
    window.location.reload();
  }

  function completeTask() {
    var bod = { "id": user.id, "task": task };
    if(task.completion)
    {
      taskobject.dispatch({type:"decrement"});
    }
    else
    {
      taskobject.dispatch({type:"increment"});
    }

    axios.post(`http://localhost:8000/donetask`, bod)
      .then(res => {
        console.log(res.data);
      })
      .catch(function (error) { if (error.response) { console.log(error.response.data); } });
    window.location.reload();
  }

  function viewFile() {
    var bod = { "id": user.id, "task": task };

    const downloadFile = async () => {
      try {
        const response = await axios.post('http://localhost:8000/gettaskfile', bod, { responseType: 'blob', });
        console.log(response);

        const fileURL = window.URL.createObjectURL(new Blob([response.data],{ type: task.filetype }));
        window.open(fileURL, '_blank');
      }
      catch (error) { console.error('Error downloading file:', error); }
    }
    downloadFile();
  }


  return (
    <div key={task._id}>
      <h5>
        <div style={{ display: 'inline' }} className="tasknamedis">
          {!(editbox) && <div style={{ display: 'inline', paddingRight: '6%' }}>{task.taskname}</div>}
          {editbox && (
            <div style={{ display: 'inline-block' }}>
              <form method="post" onSubmit={editTask} >
                <input name="taskname" defaultValue={task.taskname} className="tasknamedis2" type="text"/>{' '}
                <button className="Button">Update</button>
              </form>
            </div>
          )}
        </div>

        {task.completion && <div style={{ display: 'inline' }} className="completed"> Completed</div>}
        {!(task.completion) && <div style={{ display: 'inline' }} className="notcompleted"> Not Completed</div>}
        {' '}
        <button onClick={completeTask}>
          {task.completion && 'Mark as not done'}
          {!(task.completion) && 'Mark as done'}
        </button>

      </h5>

      {!(editbox) && <button onClick={handleEdit}>Edit</button>}
      {editbox && <button onClick={handleEdit} className="buttonon">Edit</button>}
      {' '}
      <button onClick={deleteTask}>Delete</button>
      {' '}
      {task.filepath != null && <button onClick={viewFile}>View Task File</button>}
      {' '}
      {taskSet && <> Task-Set: {taskSet}</>}


    </div>
  );
}

export default Task;