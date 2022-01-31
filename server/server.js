import express from 'express';
import path from 'path';

const app = express();
const port = 3000;

app.use(express.static(decodeURIComponent(new URL('../client/build', import.meta.url).pathname)));

app.get('/', (req, res) => {
    let val = decodeURIComponent(new URL('../client/build/index.html', import.meta.url).pathname);
    res.sendFile(val);
});

app.listen(port, (err) => {
    if (err) {
        return console.err(`Server error: ${err}`);
    }

    console.log(`Server listening on port ${port}`);
});
