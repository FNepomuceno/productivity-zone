import express from 'express';
import path from 'path';

import dotenv from 'dotenv';
import database from './config/database.js';
dotenv.config({ path: relativePath('./.env.local') });
database.connect();

import User from './model/user.js';
import Task from './model/task.js';

const app = express();
const port = 3000;

app.use(express.static(relativePath('../client/build')));

app.listen(port, (err) => {
    if (err) {
        return console.err(`Server error: ${err}`);
    }

    console.log(`Server listening on port ${port}`);
});

function relativePath(path) {
    return decodeURIComponent(
        new URL(path, import.meta.url).pathname
    );
}
