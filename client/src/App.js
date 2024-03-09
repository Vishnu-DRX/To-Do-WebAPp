import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState,createContext } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from './pages/Profile';
import Home from "./pages/Home";
import Nopage from "./pages/Nopage";
import './App.css';

export const TaskContext = createContext();

function App() {
  
  const [taskset, setTaskset] = useState('');

  function setTask(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    setTaskset(formData.get("taskset"));
  }
  console.log(Profile.getId())
  return (<>
    <header className="App-header">
      <h2>To-Do Tracker</h2>
      {!(Profile.getId()==='null') && <div>
      <form method="submit" onSubmit={setTask} >
        <input name="taskset" placeholder="Enter Task-Set" type="text" />{' '}
        <button className="Button">Set</button>
      </form>
      <br></br>
      </div>}
    </header>
    <TaskContext.Provider value={taskset}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="Login" element={<Login />} />
        <Route path="Signup" element={<Signup />} />
        <Route path="*" element={<Nopage />} />
      </Routes>
    </BrowserRouter>
    </TaskContext.Provider>
  </>
  );
}

export default App;