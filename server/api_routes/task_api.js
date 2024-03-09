import express from 'express';
import fs from 'fs';
import path from 'path';
const __dirname = path.resolve();
import multer from 'multer';//for handling of file uploads
const router=express.Router();
import User from './../src/models/user.js';//loading the schmea for mongoDb

const upload = multer({ dest: 'uploads/' });


router.post('/addtask', upload.single("file") ,async function (req, res) {
    try {
        var fpath;var ftype;
        console.log(req.file);
        console.log(req.body);

        if(req.file==null)
        {fpath=null;ftype=null;}
        else
        {fpath=req.file.path;ftype=req.file.mimetype;}
        
        const foundUser = await User.findById(req.body.id);
        var task={ taskname: req.body.taskname, completion: false , filepath: fpath, filetype: ftype};
        foundUser.tasks.push(task);
        foundUser.save();
        res.send("task added");
    }
    catch (err) { console.log(err); }
    res.end();
})

router.post('/deltask', async function (req, res) {
    try {
        const foundUser = await User.findById(req.body.id);
        const tasks =foundUser.tasks;
        
        function match(tasks)
        {return tasks.taskname===req.body.task.taskname;}
        var index=tasks.findIndex(match);

        if(tasks[index].filepath!=null)
        {fs.unlinkSync(tasks[index].filepath);}
        tasks.splice(index,1);

        foundUser.save();
        res.send("task deleted");
    }
    catch (err) { console.log(err); }
    res.end();
})

router.post('/edittask', async function (req, res) {
    try {
        const foundUser = await User.findById(req.body.id);
        const tasks =foundUser.tasks;

        function match(tasks)
        {return tasks.taskname===req.body.oldtask.taskname;}
        var index=tasks.findIndex(match);

        tasks[index].taskname=req.body.newtask.taskname;
        foundUser.save();
        res.send("task updated");
    }
    catch (err) { console.log(err); }
    res.end();
})

router.post('/donetask', async function (req, res) {
    try {
        const foundUser = await User.findById(req.body.id);
        const tasks =foundUser.tasks;

        function match(tasks)
        {return tasks.taskname===req.body.task.taskname;}
        var index=tasks.findIndex(match);
        
        tasks[index].completion=!(tasks[index].completion);
        foundUser.save();
        res.send("completion toggled");
    }
    catch (err) { console.log(err); }
    res.end();
})

router.post('/getalltask', async function (req, res) {
    try {
        const foundUser = await User.findById(req.body.id);
        res.send(foundUser.tasks);
    }
    catch (err) { console.log(err); }
    res.end();
})

router.post('/gettaskfile', async function (req, res) {
    try {
        const foundUser = await User.findById(req.body.id);
        const tasks =foundUser.tasks;
        var fileName="TaskFile";

        function match(tasks)
        {return tasks.taskname===req.body.task.taskname;}
        var index=tasks.findIndex(match);

        var filePath=tasks[index].filepath;

        res.download(filePath, fileName, (err) => {
            if (err) {
              console.error('Error sending file:', err);
              res.status(500).send('Server Error');
            }
          });
    }
    catch (err) { console.log(err); }
})


export default router;