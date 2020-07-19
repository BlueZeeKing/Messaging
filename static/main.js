var socket = io.connect(window.location.href); // start the socket connection

var addNewLetterBtn = document.getElementById("newLetterBack"); // get the dom of some html elements
var addNewLetterGUI = document.getElementById("newLetter");
var msgStatus = document.getElementById("msgStatus");
var to = document.getElementById("to");
var body = document.getElementById("body");

var currentStatus = 0; // set all the variables
var letters = []
var name;

function formatName (name) { // create a function that removes white space from names and removes capitalization
    return name.trim().toLowerCase();
}

function unformatName(name) { // craee a function that capitalizes the first letter of every word
    let names = name.split(" ")
    for (let i = 0; i < names.length; i++) {
        names[i] = names[i][0].toUpperCase() + names[i].substring(1, names[i].length);
    }
    return names.join(' ');
}

function clicked (e) {
    i = e['srcElement'].id.slice(1) // if it has get the index of the letter and display who the letter is from
    let letter = letters[i]

    document.getElementById('from').innerHTML = letters[i]['display'];

    let inner = '' // and display all the messages in the body of the message
    for (let i = 0; i < letter['body'].length; i++) {
        let msg = letter['body'][i].split('|');
        if (msg[0] == name) {
            inner = inner + '<div class=\'container\'><p class=\'me\'>' + msg[1] + '</p></div>'
        } else {
            inner = inner + '<div class=\'container\'><p class=\'other\'>' + msg[1] + '</p></div>'
        }
    }
    document.getElementById('bodyR').innerHTML = inner;

    console.log(letter) // then move the divider that holds all the text up
    document.getElementById('readLetter').style.transform = "translateY(0vh)";
    letter['read'] = '' // set the read to zero
    letters[i] = letter
    e.srcElement.innerHTML = letter['display'] + letter['read']
    console.log(letters)
}

function display() { // create a function to display letters
    let inner = ''; // set the inner part of the letters div element 
    if (letters.length <= 0) {
        inner = 'No letters'
    } else {
        for (let i = 0; i < letters.length - 1; i++) {
            inner = inner + '<p class = \'letter\' id="' + 'i' + i.toString() + '">' + letters[i]['display'] + ' ' + letters[i]['read'] + '</p><hr>' // create a paragraph element for each letter that shows who it is from and if it has been read
        }
        inner = inner + '<p class = \'letter\' id="' + 'i' + (letters.length - 1).toString() + '">' + letters[letters.length - 1]['display'] + letters[letters.length - 1]['read'] + '</p>' // create a paragraph element for the last letter that shows who it is from and if it has been read
    }
    document.getElementById('letters').innerHTML = inner;

    for (let i = 0; i < letters.length; i++) { // for each letter add an event listener that checks if it has been clicked
        document.getElementById('i' + i.toString()).addEventListener('click', clicked)
    }
}

document.getElementById("submit").addEventListener("click", function () {
    document.getElementById("namePrompt").style.opacity = "0";
    socket.emit('login', formatName(document.getElementById('name').value));
    name = formatName(document.getElementById('name').value);

    document.getElementById("detector").addEventListener("click", function () { // make the button pretty and make the make a new letter gui pop up
        addNewLetterBtn.className = "clicked";
        addNewLetterGUI.style.transform = "translateY(0vh)";
        setTimeout(function () {
            addNewLetterBtn.style.opacity = "0";
            setTimeout(function () {
                addNewLetterBtn.className = "notClicked";
                setTimeout(function () {
                    addNewLetterBtn.style.opacity = "1";
                }, 550)
            }, 550)
        }, 800)
    });

    document.getElementById("send").addEventListener("click", function () { // send a message to the server to get the current message index
        socket.emit('index')
    });

    document.getElementById("close").addEventListener("click", function () { // if the close button is clicked move the read letter gui down
        document.getElementById('readLetter').style.transform = "translateY(87vh)";
        open = null;
    });

    document.getElementById("closeNew").addEventListener("click", function () { // if the close button is clicked move the new letter gui down
        document.getElementById('newLetter').style.transform = "translateY(87vh)";
    });
});

socket.on('index', (data) => { // when the server responds to the index message 
    let names = to.value.replace(', ', ',').split(',') // format the names to send to
    for(let i = 0; i < names.length; i++) {
        names[i] = formatName(names[i])
    }

    data = { display: 'To: ' + to.value.replace(',', ', '), from: name, to: names, body: [name+'|'+body.value], read: '' } //  create the message data

    if (letters.length >= 15) { // delete a message if there are too many
        letters.splice(14, 10)
    }
    letters.unshift(data) // add the message data to the letters

    display() // display all the messages

    socket.emit('send', JSON.stringify(data)) // send the letter to the server

    addNewLetterGUI.style.transform = "translateY(87vh)"; // move the new letter gui down
    setTimeout(function () { // erase the inputs after 0.6 seconds
        to.value = '';
        body.value = '';
    }, 600)
})

socket.on('recieve', (dataRaw) => { // when a message is recieved
    let data = JSON.parse(dataRaw) // parse the data and create a variable for the status
    let status = { name: data['from']}
    try { // use try to catch errors
        for (let i = 0; i < letters.length; i++) { // for each letter remove the event listener
            document.getElementById('i' + i.toString()).removeEventListener('click', function (i) {
                document.getElementById('from').innerHTML = 'From: ' + letters[i]['from'];
                document.getElementById('body').innerHTML = letters[i]['body'];
                document.getElementById('readLetter').style.transform = "translateY(0vh)";
            })
        }

        data['read'] = ' 🔵' // set the read component of the data to a blue circle to represeent it is not read
        data['display'] = 'From: ' + unformatName(data['from']) // set the display variable so it displays who it is from properly

        if (letters.length >= 15) { // if there are too many letters remove one
            letters.splice(14,10)
        }
        letters.unshift(data) // add the letter to the letters

        display() // display all the letters

        status['status'] = 200 // set the status to delivered

    } catch (e) {

        status['status'] = 400 // if there was a faliure set the status to failed
        console.log(e)

    }

    socket.emit('msgStatus', JSON.stringify(status)) // send a message to the server saying the status
})

socket.on('msgStatus', (data) => { // if a message status message is received
    if (currentStatus != 400 && currentStatus != 404) { // if a faliure message was not already received
        if (data == 200) { // if the status is something set the current statis and set the message status variable
            msgStatus.innerHTML = '✅ Delivered'
            currentStatus = 200
        } else if (data == 404) {
            msgStatus.innerHTML = '❌ User not found'
            currentStatus = 404;
        } else {
            msgStatus.innerHTML = '❌ Unknown Error'
            currentStatus = 400;
        }
        msgStatus.style.opacity = '1'; // reveal the message status element
        setTimeout(function () { // after 3 seconds reset the html element and the current status variable
            msgStatus.style.opacity = '0';
            currentStatus = 0;
        }, 3000)
    }
})