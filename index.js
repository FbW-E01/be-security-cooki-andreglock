import express from 'express';
import cookieParser from 'cookie-parser';
import { hash } from './hash.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

const logs = [];

app.post('/token', async (req, res) => {
    if (!req.body.randomNumber) {
        res.status(400).send("randomNumber not found");
        return;
    }
    const hashedNumber = await hash(req.body.randomNumber);

    // Generate date in unix seconds
    const currentCookie = { number: hashedNumber, time: new Date() }
    logs.push(currentCookie);
    res.cookie("cookie", logs);
    
    res.send('Ok');
});

app.post('/message', async (req, res) => {
    if (!req.body.message) {
        res.status(400).send("message not found");
        return;
    }
    console.log(req.cookies.cookie);
    if (!req.cookies.cookie) {
        res.status(400).send("cookie not found");
        return;
    }
    const cookie = req.cookies.cookie[req.cookies.cookie.length - 1];
    if (!cookie.time) {
        res.status(400).send("cookie time not found");
        return;
    }
    const elapsedTime = new Date - Date.parse(cookie.time);
    console.log(elapsedTime);
    console.log("Current:", new Date, "old:", cookie.time);
    if (elapsedTime > (60 * 1000) ) {
        console.log(`Cookie from: ${cookie.time.toLocaleString()}. Request from: ${new Date}`)
        res.status(400).send(`cookie expired: ${cookie.time.toLocaleString()}`);
        return;
    }
    res.send('thanks for the message');
});

app.listen(8080, () => console.log('Listening on http://localhost:8080'));