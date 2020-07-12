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
    console.log('URL is: ' + serverURL + '\nPort is: '+port.toString()+'\n\n')
})

const io = require("socket.io")(server)

io.on('connection', (socket) => {
    let name

    socket.on('login', (data) => {
        em.addListener(data, function (data) {
            socket.emit('recieve', data)
        })
        em.addListener(data+'status', function (data) {
            socket.emit('msgStatus', data)
        })
        users.push(data)
        name = data
    })

    socket.on('send', (dataRaw) => {
        let data = JSON.parse(dataRaw)
        if (users.includes(data['to'])) {
            em.emit(data['to'], dataRaw)
        } else {
            socket.emit('msgStatus', 404)
        }
    })

    socket.on('msgStatus', (dataRaw) => {
        let data = JSON.parse(dataRaw)
        em.emit(data['name']+'status', data['status'])
        console.log('recieved status')
    })

    socket.on('disconnect', () => {
        em.removeAllListeners(name)
        em.removeAllListeners(name+'status')
        users.splice(users.indexOf(name), 1)
    });
});