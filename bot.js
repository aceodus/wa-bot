const express = require('express');
const http = require('http');
const twilio = require('twilio');
const axios = require('axios')

const app = express();
const MessagingResponse = twilio.twiml.MessagingResponse;
const PORT = 3000

app.set('port', PORT);
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
        message = new MessagingResponse().message('this is some random image of cat for you').media('https://cataas.com/cat')
    }
    else {
        message = new MessagingResponse().message('I\'m sorry i don\'t understand')
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

