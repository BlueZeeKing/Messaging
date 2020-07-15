var socket = io.connect(window.location.href);

var currentStatus = 0;

var addNewLetterBtn = document.getElementById("newLetterBack");
var addNewLetterGUI = document.getElementById("newLetter");
var msgStatus = document.getElementById("msgStatus");

var to = document.getElementById("to");
var body = document.getElementById("body");

var letters = []

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
            document.getElementById('bodyR').innerHTML = letters[i]['body'];
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
        console.log('send')
        let names = to.value.replace(', ', ',').split(',')
        for (let i = 0; i < names.length; i++) {
            names[i] = formatName(names[i])
        }
        socket.emit('send', JSON.stringify({ from: name, to: names, body: body.value }))
        addNewLetterGUI.style.transform = "translateY(87vh)";
        console.log(JSON.stringify({ from: name, to: names, body: body.value }))
        setTimeout(function () {
            to.value = '';
            body.value = '';
        }, 600)
    });

    document.getElementById("close").addEventListener("click", function () {
        document.getElementById('readLetter').style.transform = "translateY(87vh)";
    });
    document.getElementById("closeNew").addEventListener("click", function () {
        document.getElementById('newLetter').style.transform = "translateY(87vh)";
    });
});
socket.on('recieve', (dataRaw) => {
    console.log('recieved')
    let data = JSON.parse(dataRaw)
    let status = { name: data['from']}
    try {
        for (let i = 0; i < letters.length; i++) {
            document.getElementById('i' + i.toString()).removeEventListener('click', function (i) {
                document.getElementById('from').innerHTML = 'From: ' + letters[i]['from'];
                document.getElementById('body').innerHTML = letters[i]['body'];
                document.getElementById('readLetter').style.transform = "translateY(0vh)";
            })
        }
        if (letters.length >= 15) {
            letters.splice(14,10)
        }
        data['read'] = ' 🔵'
        data['from'] = unformatName(data['from'])
        letters.unshift(data)
        display()
        status['status'] = 200
    } catch {
        status['status'] = 400
    }
    socket.emit('msgStatus', JSON.stringify(status))
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