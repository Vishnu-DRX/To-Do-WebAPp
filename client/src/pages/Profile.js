import axios from "axios";

var Profile = (function () {
    var Db_Id = null;
    var username = null;
    var taskcount=0;

    var setTaskcount= function(count) {
        taskcount=count;
        sessionStorage.setItem("taskcount", taskcount);
    }

    var getTaskcount= function() {
        taskcount= sessionStorage.getItem("taskcount");
        if(taskcount=='NaN')
        return 0;
        else
        return taskcount;
    }

    var setProfile = async function (Id) {
        sessionStorage.setItem("id_key", Id);
        Db_Id = Id;
        
        var UserId = { "id": Id};
        await axios.post(`http://localhost:8000/getuser`, UserId)
            .then(res => {
                console.log(res);
                username=res.data.foundUser.username;
                console.log(username);
                sessionStorage.setItem("username_key", username);
                
            })
            .catch(function (error) {if (error.response) {console.log(error.response.data);}});
    };

    var getTasks=async  function () {
        var UserId = { "id": Db_Id };
        var tasks=[];
        await axios.post(`http://localhost:8000/getalltask`, UserId)
          .then(res => {tasks=res.data;})
          .catch(function (error) { if (error.response) { console.log(error.response.data); } });
        return tasks;
    };

    var getId = function () { Db_Id = sessionStorage.getItem("id_key"); return Db_Id; };
    var getUsername = function () { username = sessionStorage.getItem("username_key"); return username; };

    var setId = function (Id) { sessionStorage.setItem("id_key", Id); Db_Id = Id; };
    var setUsername = function (name) { sessionStorage.setItem("username_key", name); username = name; };

    var clearProfile = function () { sessionStorage.setItem("id_key", null);sessionStorage.setItem("username_key", null);Db_Id = null; username = ""; };

    return {
        setProfile: setProfile,
        getTasks: getTasks,
        getId: getId,
        setId: setId,
        getUsername: getUsername,
        setUsername: setUsername,
        clearProfile: clearProfile,
        setTaskcount: setTaskcount,
        getTaskcount: getTaskcount
    }

})();

export default Profile;