import express from 'express';
const router=express.Router();
import User from './../src/models/user.js';//loading the schmea for mongoDb 

router.post('/postuser', async function (req, res) {
    try {
        const postedUser = await User.create({ username: req.body.username, email: req.body.email, password: req.body.password, });
        console.log("User info saved to database with id: " + postedUser._id);
    }
    catch (err) { res.send(err); console.log(err); }

    res.end()
})

router.post('/getuser', async function (req, res) {
    try {
        const foundUser = await User.findById(req.body.id);
        res.send({foundUser});
    }
    catch (err) { console.log(err); }
    res.end();
})

router.get('/getallusers', async function (req, res) {
    const allUsers = await User.find();
    res.send(allUsers)
})

router.post('/authuser', async function (req, res) {
    try {
        var auth = 0;
        const foundUser = await User.find({ email: req.body.email });

        if (foundUser[0] != null) {
            auth = 1;
            console.log("Login User found with id: " + foundUser[0]._id);
            if (foundUser[0].password === req.body.password) { auth = 2; }
        }

        res.send({ auth });
    }
    catch (err) { console.log(err); }
    res.end();
})

router.post('/getuserid', async function (req, res) {
    try {
        var id=null;
        const foundUser = await User.find({ email: req.body.email });
        id=foundUser[0]._id.toString();
        console.log("User found with id: " + id);
        res.send({id});
    }
    catch (err) { console.log(err); }
    res.end();
})

export default router;