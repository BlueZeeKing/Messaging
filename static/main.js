var socket = io.connect(window.location.href);

var currentStatus = 0;
var nameMain;

var addNewLetterBtn = document.getElementById("newLetterBack");
var addNewLetterGUI = document.getElementById("newLetter");
var msgStatus = document.getElementById("msgStatus");

var to = document.getElementById("to");
var body = document.getElementById("body");

var letters = []
var indexs = []
var open = null
var alreadyRead = false;

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
            inner = inner + '<p class = \'letter\' id="' + 'i' + i.toString() + '">' + letters[i]['displayName'] + ' ' + letters[i]['read'] + '</p><hr>'
        }
        inner = inner + '<p class = \'letter\' id="' + 'i' + (letters.length - 1).toString() + '">' + letters[letters.length - 1]['displayName'] + letters[letters.length - 1]['read'] + '</p>'
    }
    document.getElementById('letters').innerHTML = inner;
    for (let i = 0; i < letters.length; i++) {
        document.getElementById('i' + i.toString()).addEventListener('click', function (e) {
            i = e['srcElement'].id.slice(1)
            document.getElementById('from').innerHTML = letters[i]['displayName'];
            open = letters[i]['index']

            let inner = '';
            for (let i2 = 0; i2 < letters[i]['body'].length; i2++) {
                msg = letters[i]['body'][i2].split('|');
                if (msg[0] == nameMain) {
                    inner = inner + '<div class=\'container\'><p class="msg me">' + msg[1] + '</p></div>'
                } else {
                    inner = inner + '<div class=\'container\'><p class="msg other">' + msg[1] + '</p></div>'
                }
                
            }

            document.getElementById('bodyR').innerHTML = inner;
            document.getElementById('readLetter').style.transform = "translateY(0vh)";
            letters[i]['read'] = ''
            display()
        })
    }
}

document.getElementById("submit").addEventListener("click", function () {
    document.getElementById("namePrompt").style.opacity = "0";
    socket.emit('login', formatName(document.getElementById('name').value));
    nameMain = formatName(document.getElementById('name').value);

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
        data['body'].push(nameMain + '|' + document.getElementById('replyMsg').value)
        socket.emit('send', JSON.stringify(data))
        document.getElementById('replyMsg').value = '';
        let inner = '';
        for (let i = 0; i < data['body'].length; i++) {
            msg = data['body'][i].split('|');
            if (msg[0] == nameMain) {
                inner = inner + '<div class=\'container\'><p class="msg me">' + msg[1] + '</p></div>'
            } else {
                inner = inner + '<div class=\'container\'><p class="msg other">' + msg[1] + '</p></div>'
            }
        }
        document.getElementById('bodyR').innerHTML = inner;
        alreadyRead = true;
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
    for (let i = 0; i < letters.length; i++) {
        document.getElementById('i' + i.toString()).removeEventListener('click', function (e) {
            i = e['srcElement'].id.slice(1)
            document.getElementById('from').innerHTML = 'From: ' + letters[i]['from'];

            let inner = '';
            for (let i2 = 0; i2 < letters[i2]['body'].length; i2++) {
                msg = letters[i2]['body'].split('|');
                if (msg[0] == nameMain) {
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
    if (alreadyRead == true) {
        data['read'] = ''
    } else {
        data['read'] = ' 🔵'
    }
    data['displayName'] = 'From: ' + unformatName(data['from'])
    try {
        if (indexs.includes(data['index'])) {
            for (let i = 0; i < letters.length; i++) {
                if (letters[i]['index'] == data['index']) {
                    letters[i] = data;
                    if (open == letters[i]['index']) {
                        for (let i2 = 0; i2 < data['body'].length; i2++) {
                            msg = data['body'][i2].split('|');
                            let inner = '';
                            if (msg[0] == nameMain) {
                                inner = inner + '<div class=\'container\'><p class="msg me">' + msg[1] + '</p></div>'
                            } else {
                                inner = inner + '<div class=\'container\'><p class="msg other">' + msg[1] + '</p></div>'
                            }
                            console.log(data['body'].length)
                            console.log(i2)
                        }
                        document.getElementById('bodyR').innerHTML = inner;
                        data['read'] = ''
                    }
                }
            }
        } else {
            if (letters.length >= 15) {
                letters.splice(14, 10)
            }
            letters.unshift(data)
            indexs.push(data['index'])
        }
        display()
        status['status'] = 200
    } catch (e) {
        status['status'] = 400
        console.log(e.message)
    }
    socket.emit('msgStatus', JSON.stringify(status))
})

socket.on('index', (data) => {
    for (let i = 0; i < letters.length; i++) {
        document.getElementById('i' + i.toString()).removeEventListener('click', function (e) {
            i = e['srcElement'].id.slice(1)
            document.getElementById('from').innerHTML = 'From: ' + letters[i]['from'];

            let inner = '';
            for (let i2 = 0; i2 < letters[i2]['body'].length; i2++) {
                msg = letters[i2]['body'].split('|');
                if (msg[0] == nameMain) {
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
    let names = to.value.replace(', ', ',').split(',')
    for (let i = 0; i < names.length; i++) {
        names[i] = formatName(names[i])
    }
    if (letters.length >= 15) {
        letters.splice(14, 10)
    }
    letters.unshift({ read: '', displayName: 'To: ' + to.value.replace(',',', '), index: data, from: nameMain, to: names, body: [nameMain + '|' + body.value] })
    display()
    socket.emit('send', JSON.stringify({ index: data, from: nameMain, to: names, body: [nameMain + '|' + body.value] }))
    console.log(nameMain)
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