const express = require('express');
const http = require('http');
const twilio = require('twilio');
// const fetch = require('node-fetch');
const axios = require('axios')

const app = express();
// const router = express.Router();
const MessagingResponse = twilio.twiml.MessagingResponse;
const PORT = 3000

app.set('port', PORT);
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/', async (req,res) => {
    let message;
    console.log(req.body)
    if (req.body.Body == '/quote') {
        try {
            const response = await axios.get('https://api.quotable.io/random/')
            message = new MessagingResponse().message(`${response.data.author} - ${response.data.content}`)
        } catch (error) {
            message = new MessagingResponse().message('Could not retrive a quote this time, sorry')
        }
    }
    else if (req.body.Body == '/cat') {
        // if (req.body.NumMedia > 0) {
        // let cat = "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
        message = new MessagingResponse().message('this is some random image of cat for you').media('https://cataas.com/cat')
        // }
        // else {
        //     MessagingResponse.message('cannot show image');
        // }
        // res.set('Content-Type', 'text/xml');
        // res.status(200).send(MessagingResponse.toString());
    }
    else {
        message = new MessagingResponse().message('I\'m sorry i don\'t understand')
        // res.set('Content-Type', 'text/xml');
        // res.status(200).send(MessagingResponse.toString())
    }
    res.set('Content-Type', 'text/xml');
    res.status(200).send(await message.toString())
})
    

let server = http.createServer(app);
server.listen(PORT)

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}

server.on('listening', onListening);

