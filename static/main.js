const url = "192.168.4.31:3000";

var socket = io.connect('http://' + url);

var addNewLetterBtn = document.getElementById("newLetterBack");
var addNewLetterGUI = document.getElementById("newLetter");

var to = document.getElementById("to");
var body = document.getElementById("body");

var letters = []

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
    socket.emit('login', document.getElementById('name').value);
    var name = document.getElementById('name').value;

    document.getElementById("detector").addEventListener("click", function () {
        addNewLetterBtn.className = "clicked";
        to.value = '';
        body.value = '';
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
        socket.emit('send', JSON.stringify({ from: name, to: to.value, body: body.value}))
        addNewLetterGUI.style.transform = "translateY(87vh)";
        console.log(JSON.stringify({ from: name, to: to.value, body: body.value }))
    });

    document.getElementById("close").addEventListener("click", function () {
        document.getElementById('readLetter').style.transform = "translateY(87vh)";
    });
});
socket.on('recieve', (dataRaw) => {
    for (let i = 0; i < letters.length; i++) {
        document.getElementById('i' + i.toString()).removeEventListener('click', function (i) {
            document.getElementById('from').innerHTML = 'From: ' + letters[i]['from'];
            document.getElementById('body').innerHTML = letters[i]['body'];
            document.getElementById('readLetter').style.transform = "translateY(0vh)";
        })
    }
    if (letters.length >= 10) {
        letters.splice(9,10)
    }
    let data = JSON.parse(dataRaw)
    data['read'] = ' 🔵'
    letters.unshift(data)
    display()
})