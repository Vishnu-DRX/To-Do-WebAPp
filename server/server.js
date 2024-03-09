import express from 'express';
import http from 'http';
import mongoose from 'mongoose';//for mongoDB schemas
import cors from 'cors';//for cross orgine resource sharing
import bodyParser from 'body-parser';//to parse the req.body as json
const app = express();

import user_api from './api_routes/user_api.js';
import task_api from './api_routes/task_api.js';

const corsOptions = { origin: true, credentials: true, };
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.use(user_api);
app.use(task_api);


const port = 8000;
let server = null;
server = http.createServer(app);

async function start() {
    try {
        await mongoose.connect("mongodb://0.0.0.0:27017/todo_app");
        console.log("Connected to local MongoDB.");
        server.listen(port, () => console.log("Server started on port: " + port));
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
}

start();
export default { app };