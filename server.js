const express = require('express')
const app = express()
var events = require('events');

var serverURL = "0.0.0.0"
var port = 3000

var users = [];

app.set('view engine', 'ejs')
app.use(express.static('static'))
var em = new events.EventEmitter();

app.get('/', function (req, res) {
    res.render('index')
})

server = app.listen(port, serverURL, function () {
    console.log('Example app listening on port ' + port + '!')
})

const io = require("socket.io")(server)

io.on('connection', (socket) => {
    console.log('a user connected')
    let name

    socket.on('login', (data) => {
        em.addListener(data, function (data) {
            socket.emit('recieve', data)
        })
        users.push(data)
        name = data
    })

    socket.on('send', (dataRaw) => {
        let data = JSON.parse(dataRaw)
        if (users.includes(data['to'])) {
            em.emit(data['to'], dataRaw)
        }
        console.log(dataRaw)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
        em.removeAllListeners(name)
        users.splice(users.indexOf(name), 1)
    });
});