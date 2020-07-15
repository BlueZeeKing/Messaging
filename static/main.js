var socket = io.connect(window.location.href);

var currentStatus = 0;

var addNewLetterBtn = document.getElementById("newLetterBack");
var addNewLetterGUI = document.getElementById("newLetter");
var msgStatus = document.getElementById("msgStatus");

var to = document.getElementById("to");
var body = document.getElementById("body");

var letters = []
var indexs = []
var open = null

function formatName (name) {
    return name.trim().toLowerCase();
}

function unformatName(name) {
    let names = name.split(" ")
    for (let i = 0; i < names.length; i++) {
        names[i] = names[i][0].toUpperCase() + names[i].substring(1, names[i].length);
    }
    return names.join(' ');
}

function display() {
    let inner = '';

    if (letters.length <= 0) {
        inner = 'No letters'
    } else {
        for (let i = 0; i < letters.length - 1; i++) {
            inner = inner + '<p class = \'letter\' id="' + 'i' + i.toString() + '">From: ' + letters[i]['from'] + ' ' + letters[i]['read'] + '</p><hr>'
        }
        inner = inner + '<p class = \'letter\' id="' + 'i' + (letters.length - 1).toString() + '">From: ' + letters[letters.length - 1]['from'] + letters[letters.length - 1]['read'] + '</p>'
    }
    console.log(inner)
    document.getElementById('letters').innerHTML = inner;
    for (let i = 0; i < letters.length; i++) {
        document.getElementById('i' + i.toString()).addEventListener('click', function (e) {
            i = e['srcElement'].id.slice(1)
            document.getElementById('from').innerHTML = 'From: ' + letters[i]['from'];
            open = letters[i]['index']

            let inner = '';
            for (let i2 = 0; i2 < letters[i]['body'].length; i2++) {
                msg = letters[i]['body'][i2].split('|');
                if (msg[0] == name) {
                    inner = inner + '<p class="msg me">' + msg[1] + '</p>'
                } else {
                    inner = inner + '<p class="msg other">' + msg[1] + '</p>'
                }
                
            }

            document.getElementById('bodyR').innerHTML = inner;
            console.log(letters[i])
            document.getElementById('readLetter').style.transform = "translateY(0vh)";
            letters[i]['read'] = ''
            display()
        })
    }
}

document.getElementById("submit").addEventListener("click", function () {
    document.getElementById("namePrompt").style.opacity = "0";
    socket.emit('login', formatName(document.getElementById('name').value));
    var name = formatName(document.getElementById('name').value);

    document.getElementById("detector").addEventListener("click", function () {
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

    document.getElementById("send").addEventListener("click", function () {
        socket.emit('index')
    });

    document.getElementById('reply').addEventListener('click', function () {
        let data;
        for (let i = 0; i < letters.length; i++) {
            if (letters[i]['index'] == open) {
                data = letters[i];
            }
        }
        delete data['read'];
        data['from'] = formatName(data['from'])
        data['body'].push(name + '|' + document.getElementById('replyMsg').value)
        socket.emit('send', JSON.stringify(data))
    })

    document.getElementById("close").addEventListener("click", function () {
        document.getElementById('readLetter').style.transform = "translateY(87vh)";
        open = null;
    });
    document.getElementById("closeNew").addEventListener("click", function () {
        document.getElementById('newLetter').style.transform = "translateY(87vh)";
    });
});
socket.on('recieve', (dataRaw) => {
    console.log('recieved')
    for (let i = 0; i < letters.length; i++) {
        document.getElementById('i' + i.toString()).removeEventListener('click', function (e) {
            i = e['srcElement'].id.slice(1)
            document.getElementById('from').innerHTML = 'From: ' + letters[i]['from'];

            let inner = '';
            for (let i2 = 0; i2 < letters[i2]['body'].length; i2++) {
                msg = letters[i2]['body'].split('|');
                if (msg[0] == name) {
                    inner = inner + '<p class="msg me">' + msg[1] + '</p>'
                } else {
                    inner = inner + '<p class="msg other">' + msg[1] + '</p>'
                }

            }

            document.getElementById('bodyR').innerHTML = inner;
            console.log(letters[i])
            document.getElementById('readLetter').style.transform = "translateY(0vh)";
            letters[i]['read'] = ''
            display()
        })
    }
    let data = JSON.parse(dataRaw)
    let status = { name: data['from']}
    data['read'] = ' 🔵'
    data['from'] = unformatName(data['from'])
    try {
        if (indexs.includes(data['index'])) {
            if (letters.length >= 15) {
                letters.splice(14,10)
            }
            letters.unshift(data)
        } else {
            for (let i = 0; i < letters.length; i++) {
                if (letters[i]['index'] == data['index']) {
                    letters[i] = data;
                }
            }
        }
        display()
        status['status'] = 200
    } catch {
        status['status'] = 400
    }
    socket.emit('msgStatus', JSON.stringify(status))
})

socket.on('index', (data) => {
    console.log('send')
    let names = to.value.replace(', ', ',').split(',')
    for (let i = 0; i < names.length; i++) {
        names[i] = formatName(names[i])
    }
    socket.emit('send', JSON.stringify({ index: data, from: name, to: names, body: [name + '|' + body.value] }))
    addNewLetterGUI.style.transform = "translateY(87vh)";
    setTimeout(function () {
        to.value = '';
        body.value = '';
    }, 600)
})

socket.on('msgStatus', (data) => {
    if (currentStatus != 400 && currentStatus != 404) {
        if (data == 200) {
            msgStatus.innerHTML = '✅ Delivered'
            currentStatus = 200
        } else if (data == 404) {
            msgStatus.innerHTML = '❌ User not found'
            currentStatus = 404;
        } else {
            msgStatus.innerHTML = '❌ Unknown Error'
            currentStatus = 400;
        }
        msgStatus.style.opacity = '1';
        setTimeout(function () {
            msgStatus.style.opacity = '0';
            currentStatus = 0;
        }, 3000)
    }
})