const express = require('express') // import all the modules
const app = express()
const events = require('events');
const config = require('config')

var users = []; // set all the variables
var id = 0;

app.set('view engine', 'ejs') // set the rendering engine events library and static folder
app.use(express.static('static'))
var em = new events.EventEmitter();

app.get('/', function (req, res) { // when visiting the site render the main page
    res.render('index')
})

server = app.listen(config.get('app.port'), config.get('app.host'), function () { // start the server
    console.log('URL is: ' + serverURL + '\nPort is: '+port.toString()+'\n\n')
})

const io = require("socket.io")(server) // set up socket.io

io.on('connection', (socket) => { // when a user connects
    let name // set the name variable

    socket.on('login', (data) => { // when a login message is recieved 
        em.addListener(data, function (data) { // create a event listener to recieve messages and message status alerts
            socket.emit('recieve', data)
        })
        em.addListener(data + 'status', function (data) {
            socket.emit('msgStatus', data)
        })
        em.addListener(data + 'reply', function (data) {
            socket.emit('reply', data)
            console.log('reply')
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

    socket.on('msgStatus', (dataRaw) => { // when a message status alert is recieved forward that alert to where it should go
        let data = JSON.parse(dataRaw)
        em.emit(data['name']+'status', data['status'])
    })

    socket.on('id', (data) => { // when an id message is recieved send back a message with the current id than add one to the id
        socket.emit('id', id)
        id++
    })

    socket.on('reply', (dataRaw) => {
        let data = JSON.parse(dataRaw)
        console.log(data)
        
        for (let i = 0; i < data['users'].length; i++) {
            if (users.includes(data['users'][i])) {
                em.emit(data['users'][i] + 'reply', dataRaw)
            } else {
                socket.emit('msgStatus', 404)
            }
        }
    })

    socket.on('disconnect', () => { // when a user diconnects remove the event listeners assoicted with them and remove them from the users list
        em.removeAllListeners(name)
        em.removeAllListeners(name+'status')
        users.splice(users.indexOf(name), 1)
        console.log(users)
    });
});