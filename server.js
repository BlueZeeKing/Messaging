const express = require('express') // import all the modules
const app = express()
var events = require('events');

var serverURL = "0.0.0.0" // set the server url
var port = 3000

var users = []; // set all the variables
var index = 0;

app.set('view engine', 'ejs') // set the rendering engine events library and static folder
app.use(express.static('static'))
var em = new events.EventEmitter();

app.get('/', function (req, res) { // when visiting the site render the main page
    res.render('index')
})

server = app.listen(port, serverURL, function () { // start the server
    console.log('URL is: ' + serverURL + '\nPort is: '+port.toString()+'\n\n')
})

const io = require("socket.io")(server) // set up socket.io

io.on('connection', (socket) => { // when a user connects
    let name // set the name variable

    socket.on('login', (data) => { // when a login message is recieved 
        em.addListener(data, function (data) { // create a event listener to recieve messages and message status alerts
            socket.emit('recieve', data)
        })
        em.addListener(data+'status', function (data) {
            socket.emit('msgStatus', data)
        })
        users.push(data) // add the user to the list of users and set the name variable to the name of the user
        name = data
    })

    socket.on('send', (dataRaw) => { //  when a send message is recieved forward it to the person it is to
        let data = JSON.parse(dataRaw)
        for (let i = 0; i < data['to'].length; i++) {
            if (users.includes(data['to'][i])) {
                em.emit(data['to'][i], dataRaw)
            } else {
                socket.emit('msgStatus', 404)
            }
        }
    })

    socket.on('msgStatus', (dataRaw) => { // when a message status alert is recieved 
        let data = JSON.parse(dataRaw)
        em.emit(data['name']+'status', data['status'])
    })

    socket.on('index', (data) => {
        socket.emit('index', index)
        index++
    })

    socket.on('disconnect', () => {
        console.log(users)
        em.removeAllListeners(name)
        em.removeAllListeners(name+'status')
        users.splice(users.indexOf(name), 1)
    });
});