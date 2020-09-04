var addNewLetterGUI = document.getElementById("newLetter");
var msgStatus = document.getElementById("msgStatus");
var body = document.getElementById("body");
var readBody = document.getElementById('bodyR');
var lettersObj = document.getElementById('letters');
var backdrop = document.getElementById('backdrop');
var currentStatus = 0; // set all the variables

var letters = [];
var name;
var open = false;
var changeEvent = new Event('change');
lettersObj.addEventListener('scroll', function () {
  // when the main body is scrolled
  if (lettersObj.scrollHeight - lettersObj.clientHeight == lettersObj.scrollTop) {
    // if it is scrolled all the way down remove the rounding at the bottom of the scroll bar
    document.documentElement.style.setProperty('--scroll-bottom-radius', '0px');
  } else if (0 == lettersObj.scrollTop) {
    // if it is scrolled all the way up remove the rounding at the top of the scroll bar
    document.documentElement.style.setProperty('--scroll-top-radius', '0px');
  } else {
    // otherwise keep the rounding
    document.documentElement.style.setProperty('--scroll-top-radius', '9px');
    document.documentElement.style.setProperty('--scroll-bottom-radius', '9px');
  }
});

function formatName(name) {
  // create a function that removes white space from names and removes capitalization
  return name.trim().toLowerCase();
}

function unformatName(name) {
  // craee a function that capitalizes the first letter of every word
  let names = name.split(" ");

  for (let i = 0; i < names.length; i++) {
    names[i] = names[i][0].toUpperCase() + names[i].substring(1, names[i].length);
  }

  return names.join(' ');
}

function clicked(e) {
  // make a function that handles when a letter is opened
  i = e['srcElement'].id.slice(1); // if it has get the id of the letter and display who the letter is from

  let letter = letters[i];
  open = letter['id'];
  document.getElementById('from').innerHTML = letters[i]['display'];
  let inner = ''; // and display all the messages in the body of the message

  for (let i = 0; i < letter['body'].length; i++) {
    let msg = letter['body'][i].split('|');

    if (msg[0] == name) {
      inner = inner + "<div class='text-right text-xs text-gray-600'>" + unformatName(msg[0]) + "</div><div class='text-right'>" + msg[1] + "</div>";
    } else {
      inner = inner + "<div class='text-left text-xs text-gray-600'>" + unformatName(msg[0]) + "</div><div class='text-left'>" + msg[1] + "</div>";
    }
  }

  readBody.innerHTML = inner;
  openReadLetter();
  letter['read'] = ''; // set the read to zero

  letters[i] = letter;
  e.srcElement.innerHTML = letter['display'] + letter['read'];
}

function display() {
  // create a function to display letters
  let inner = ''; // set the inner part of the letters div element 

  if (letters.length <= 0) {
    inner = '<p>No letters</p>';
  } else {
    for (let i = 0; i < letters.length - 1; i++) {
      inner = inner + '<p class = \'font-bold p-1\' id="' + 'i' + i.toString() + '">' + letters[i]['display'] + ' ' + letters[i]['read'] + '</p><hr class=\'mx-2 border-2 border-green-400\'>'; // create a paragraph element for each letter that shows who it is from and if it has been read
    }

    inner = inner + '<p class = \'font-bold p-1\' id="' + 'i' + (letters.length - 1).toString() + '">' + letters[letters.length - 1]['display'] + letters[letters.length - 1]['read'] + '</p>'; // create a paragraph element for the last letter that shows who it is from and if it has been read
  }

  document.getElementById('letters').innerHTML = inner;

  for (let i = 0; i < letters.length; i++) {
    // for each letter add an event listener that checks if it has been clicked
    document.getElementById('i' + i.toString()).addEventListener('click', clicked);
  }
}

function closeReadLetter() {
  let animation = anime.timeline({
    autoplay: true,
    duration: 1000,
    easing: 'easeInOutSine',
    complete: function () {
      backdrop.style.zIndex = '0';
    }
  });
  animation.add({
    targets: backdrop,
    opacity: 0,
    duration: 500
  });
  animation.add({
    targets: document.getElementById('readLetter'),
    translateY: '95vh',
    duration: 500
  });
}

function closeNewLetter() {
  let animation = anime.timeline({
    autoplay: true,
    duration: 1000,
    easing: 'easeInOutSine',
    complete: function () {
      backdrop.style.zIndex = '0';
    }
  });
  animation.add({
    targets: backdrop,
    opacity: 0,
    duration: 500
  });
  animation.add({
    targets: document.getElementById('newLetter'),
    translateY: '95vh',
    duration: 500
  });
}

function openReadLetter() {
  let animation = anime.timeline({
    autoplay: true,
    duration: 1000,
    easing: 'easeInOutSine',
    begin: function () {
      backdrop.style.zIndex = '40';
    }
  });
  animation.add({
    targets: document.getElementById('readLetter'),
    translateY: ['91vh', '0vh'],
    duration: 500
  });
  animation.add({
    targets: backdrop,
    opacity: 0.5,
    duration: 500
  });
}

function openNewLetter() {
  let animation = anime.timeline({
    autoplay: true,
    duration: 1000,
    easing: 'easeInOutSine',
    begin: function () {
      backdrop.style.zIndex = '40';
    }
  });
  animation.add({
    targets: document.getElementById('newLetter'),
    translateY: ['91vh', '0vh'],
    duration: 500
  });
  animation.add({
    targets: backdrop,
    opacity: 0.5,
    duration: 500
  });
}

function submitName() {
  // when you submit your name
  var socket = io.connect(window.location.href); // start the socket connection

  name = formatName(document.getElementById('name').value);
  socket.emit('login', name);
  socket.on('goodlogin', () => {
    let animation = anime.timeline({
      autoplay: true,
      duration: 1000,
      easing: 'easeInOutSine',
      complete: function () {
        document.getElementById("namePrompt").style.transform = "translate(0,100vh)";
        backdrop.style.zIndex = '0';
      }
    });
    animation.add({
      targets: backdrop,
      opacity: 0,
      duration: 500
    });
    animation.add({
      targets: document.getElementById("namePrompt"),
      opacity: 0,
      duration: 500
    });
    document.getElementById("detector").addEventListener("click", function () {
      // when the new letter button is clicked make the button pretty and make the make a new letter gui pop up
      openNewLetter();
    });
    document.getElementById("send").addEventListener("click", function () {
      socket.emit('id');
    }); // send a message to the server to get the current message id

    to.addEventListener("keypress", function (e) {
      if (e.code == 'Enter') socket.emit('id');
    });
    document.getElementById("close").addEventListener("click", function () {
      // if the close button is clicked move the read letter gui down
      closeReadLetter();
      open = false;
    });
    document.getElementById("closeNew").addEventListener("click", function () {
      // if the close button is clicked move the new letter gui down
      closeNewLetter();
    });
    document.getElementById('reply').addEventListener('click', function () {
      // if the reply button is clicked
      if (document.getElementById('replyMsg').value != '') {
        let letter; // get the open letter

        for (let i = 0; i < letters.length; i++) {
          if (letters[i]['id'] == open) {
            letter = letters[i];
          }
        }

        let data = {
          users: letter['to'].concat(letter['from']),
          from: name,
          id: letter['id'],
          reply: document.getElementById('replyMsg').value
        }; // create the data 

        document.getElementById('replyMsg').value = ''; // reset the input

        socket.emit('reply', JSON.stringify(data)); // send the data
      }
    });
    document.getElementById('replyMsg').addEventListener('keypress', function (e) {
      // if the reply button is clicked
      if (e.code == 'Enter' && document.getElementById('replyMsg').value != '') {
        let letter; // get the open letter

        for (let i = 0; i < letters.length; i++) {
          if (letters[i]['id'] == open) {
            letter = letters[i];
          }
        }

        let data = {
          users: letter['to'].concat(letter['from']),
          from: name,
          id: letter['id'],
          reply: document.getElementById('replyMsg').value
        }; // create the data 

        document.getElementById('replyMsg').value = ''; // reset the input

        socket.emit('reply', JSON.stringify(data)); // send the data
      }
    });
    socket.on('id', data => {
      // when the server responds to the id message 
      console.log('send msg');
      let names = to.value.replace(', ', ',').split(','); // format the names to send to

      console.log(names);
      console.log(name);

      if (names.includes(name)) {
        names.splice(names.indexOf(name), 1);
      }

      console.log(names);

      if (names.length > 0 && body.value != '') {
        for (let i = 0; i < names.length; i++) {
          names[i] = formatName(names[i]);
        }

        data = {
          display: 'To: ' + to.value.replace(',', ', '),
          from: name,
          to: names,
          body: [name + '|' + body.value],
          read: '',
          id: data
        }; //  create the message data

        if (letters.length >= 15) {
          // delete a message if there are too many
          letters.splice(14, 10);
        }

        letters.unshift(data); // add the message data to the letters

        for (let i = 0; i < letters.length; i++) {
          // for each letter remove the event listener
          try {
            document.getElementById('i' + i.toString()).removeEventListener('click', clicked);
          } catch {}
        }

        display(); // display all the messages

        socket.emit('send', JSON.stringify(data)); // send the letter to the server

        closeNewLetter();
        setTimeout(function () {
          // erase the inputs after 0.6 seconds
          to.value = '';
          ReactDOM.render( /*#__PURE__*/React.createElement(TextInput, {
            placeholder: "To",
            id: "to"
          }), document.querySelector('#toContainer'));
          body.value = '';
        }, 600);
      } else if (names.length > 0) {
        msgStatus.innerHTML = '❌ Message is empty';
        currentStatus = 400;
        msgStatus.style.opacity = '1'; // reveal the message status element

        setTimeout(function () {
          // after 3 seconds reset the html element and the current status variable
          msgStatus.style.opacity = '0';
          currentStatus = 0;
        }, 3000);
      } else {
        msgStatus.innerHTML = '❌ Can\'t send messages to self';
        currentStatus = 404;
        msgStatus.style.opacity = '1'; // reveal the message status element

        setTimeout(function () {
          // after 3 seconds reset the html element and the current status variable
          msgStatus.style.opacity = '0';
          currentStatus = 0;
        }, 3000);
      }
    });
    socket.on('recieve', dataRaw => {
      // when a message is recieved
      let data = JSON.parse(dataRaw); // parse the data and create a variable for the status

      let status = {
        name: data['from'],
        id: data.id
      };

      try {
        // use try to catch errors
        for (let i = 0; i < letters.length; i++) {
          // for each letter remove the event listener
          document.getElementById('i' + i.toString()).removeEventListener('click', clicked);
        }

        data['read'] = ' 🔵'; // set the read component of the data to a blue circle to represeent it is not read

        data['display'] = 'From: ' + unformatName(data['from']); // set the display variable so it displays who it is from properly

        if (letters.length >= 15) {
          // if there are too many letters remove one
          letters.splice(14, 10);
        }

        letters.unshift(data); // add the letter to the letters

        display(); // display all the letters

        status['status'] = 200; // set the status to delivered
      } catch (e) {
        status['status'] = 400; // if there was a faliure set the status to failed

        console.log(e);
      }

      socket.emit('msgStatus', JSON.stringify(status)); // send a message to the server saying the status
    });
    socket.on('reply', dataRaw => {
      let data = JSON.parse(dataRaw); // get the data sent

      let status = {
        name: data['from']
      }; // create the status var

      try {
        for (let i = 0; i < letters.length; i++) {
          // find the correct letter
          if (data['id'] == letters[i]['id']) {
            let letter = letters[i];
            letter['body'].push(data['from'] + '|' + data['reply']); // add the reply to the letter

            if (open == data['id']) {
              // if the letter is open display it
              letter['read'] = '';
              document.getElementById('i' + i).innerHTML = letter['display'] + letter['read'];
              let inner = '';

              for (let i = 0; i < letter['body'].length; i++) {
                let msg = letter['body'][i].split('|');

                if (msg[0] == name) {
                  inner = inner + "<div class='text-right text-xs text-gray-600'>" + unformatName(msg[0]) + "</div><div class='text-right'>" + msg[1] + "</div>";
                } else {
                  inner = inner + "<div class='text-left text-xs text-gray-600'>" + unformatName(msg[0]) + "</div><div class='text-left'>" + msg[1] + "</div>";
                }
              }

              readBody.innerHTML = inner;
              readBody.scroll({
                top: readBody.scrollHeight - readBody.clientHeight,
                left: 0,
                behavior: 'smooth'
              }); // scroll the body
            } else {
              // otherwise set the read var to un read
              letter['read'] = ' 🔵';
              document.getElementById('i' + i).innerHTML = letter['display'] + letter['read']; // show the change
            }

            letters[i] = letter; // update the new letter
          }
        }

        status['status'] = 200; // set the status to good
      } catch (e) {
        console.log(e);
        status['status'] = 400; // if it failed set the status to bad
      }

      socket.emit('msgStatus', JSON.stringify(status)); // send a message to the server saying the status
    });
    socket.on('msgStatus', rawData => {
      // if a message status message is received
      let data = JSON.parse(rawData);
      console.log(rawData);

      if (currentStatus != 400 && currentStatus != 404) {
        // if a faliure message was not already received
        if (data.status == 200) {
          // if the status is something set the current statis and set the message status variable
          msgStatus.innerHTML = '✅ Delivered';
          currentStatus = 200;
        } else if (data.status == 404) {
          for (let i = 0; i < letters.length; i++) {
            if (letters[i].id == data.id && letters[i].to.length == 1) {
              letters.splice(i, 1);
              display();
            } else if (letters[i].id == data.id) {
              letters[i].to.splice(letters[i].to.indexOf(data.user));
              letters[i].display = 'To: ' + letters[i].to;
              console.log(letters[i]);
              display();
            }
          }

          msgStatus.innerHTML = '❌ User ' + unformatName(data.user) + ' not found';
          currentStatus = 404;
        } else {
          msgStatus.innerHTML = '❌ Unknown Error';
          currentStatus = 400;
        }

        msgStatus.style.opacity = '1'; // reveal the message status element

        setTimeout(function () {
          // after 3 seconds reset the html element and the current status variable
          msgStatus.style.opacity = '0';
          currentStatus = 0;
        }, 3000);
      }
    });
  });
  socket.on('badlogin', () => {
    document.getElementById('name').value = "";

    if (name.includes('|')) {
      msgStatus.innerHTML = '❌ Username is unavilable (Please remove all | characters)';
    } else {
      msgStatus.innerHTML = '❌ Username is taken';
    }

    currentStatus = 400;
    msgStatus.style.opacity = '1'; // reveal the message status element

    setTimeout(function () {
      // after 3 seconds reset the html element and the current status variable
      msgStatus.style.opacity = '0';
      currentStatus = 0;
    }, 3000);
  });
}

backdrop.style.width = window.innerWidth.toString() + 'px';
backdrop.style.height = window.innerHeight.toString() + 'px';
ReactDOM.render( /*#__PURE__*/React.createElement(Button, {
  class: "mx-0",
  name: "Submit"
}), document.querySelector('#submit'));
ReactDOM.render( /*#__PURE__*/React.createElement(Button, {
  name: "Send"
}), document.querySelector('#send'));
ReactDOM.render( /*#__PURE__*/React.createElement(Button, {
  name: "Close"
}), document.querySelector('#close'));
ReactDOM.render( /*#__PURE__*/React.createElement(Button, {
  name: "Reply"
}), document.querySelector('#reply'));
ReactDOM.render( /*#__PURE__*/React.createElement(TextInput, {
  placeholder: "Name",
  id: "name"
}), document.querySelector('#nameContainer'));
ReactDOM.render( /*#__PURE__*/React.createElement(TextInput, {
  placeholder: "To",
  id: "to"
}), document.querySelector('#toContainer'));
ReactDOM.render( /*#__PURE__*/React.createElement(TextInput, {
  placeholder: "Reply",
  id: "replyMsg"
}), document.querySelector('#replyMsgContainer'));
document.getElementById("to");
document.getElementById("submit").addEventListener("click", submitName);
document.getElementById("name").addEventListener("keypress", function (e) {
  if (e.code == 'Enter') submitName();
});