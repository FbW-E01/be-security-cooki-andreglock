import express from 'express';
import cookieParser from 'cookie-parser';
import { hash } from './hash.js';

const app = express();
app.use(express.json());
app.use(cookieParser());

const logs = [];

app.get('/token', async (req, res) => {
    if (!req.body.randomNumber) {
        res.status(400).send("randomNumber not found");
        return;
    }
    const hashedNumber = await hash(req.body.randomNumber);

    // Generate date in unix seconds
    const currentCookie = { number: hashedNumber, time: new Date()/1000 }
    logs.push(currentCookie);
    res.cookie("cookie", currentCookie);
    
    res.send('Ok');
});

app.post('/message', async (req, res) => {
    if (!req.body.message) {
        res.status(400).send("message not found");
        return;
    }
    if (!req.cookies.cookie) {
        res.status(400).send("cookie not found");
        return;
    }
    const cookie = req.cookies.cookie;
    if (!cookie.time) {
        res.status(400).send("cookie not found");
        return;
    }
    const elapsedTime = new Date/1000 - cookie.time;
    if (elapsedTime > 60) {
        res.status(400).send("cookie expired");
        return;
    }
    res.send('thanks for the message');
});

app.listen(8080, () => console.log('Listening on http://localhost:8080'));