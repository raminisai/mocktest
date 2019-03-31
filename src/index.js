import { data } from "./serviceNowQuestions.js";
import { retriveAllRecords } from "./servicenowCandidates";
import { TextAnalytics } from "./textanalysis.js";
// console.log(data, "index.js ");
const questions = JSON.parse(data);
const { result } = questions;
console.log(result.length);
console.log(questions["result"][0]["u_string_1"]);
try {
  var SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
  recognition.lang = "en-US";
} catch (e) {
  console.error(e);
  $(".no-browser-support").show();
  $(".app").hide();
}
// var data = this.response;

var noteTextarea = $("#note-textarea");
var instructions = $("#recording-instructions");
var notesList = $("ul#notes");

var noteContent = "";

// Get all notes from previous sessions and display them.
var notes = getAllNotes();
renderNotes(notes);

/*-----------------------------
      Voice Recognition
------------------------------*/
let documents = [];
let result1 = "wipro";
// console.log(documents["documents"][0]["id"]);
// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses.
recognition.continuous = true;

// This block is called every time the Speech APi captures a line.
recognition.onresult = function(event) {
  // event is a SpeechRecognitionEvent object.
  // It holds all the lines we have captured so far.
  // We only need the current one.
  var current = event.resultIndex;

  // Get a transcript of what was said.
  var transcript = event.results[current][0].transcript;

  // Add the current transcript to the contents of our Note.
  // There is a weird bug on mobile, where everything is repeated twice.
  // There is no official solution so far so we have to handle an edge case.
  var mobileRepeatBug =
    current == 1 && transcript == event.results[0][0].transcript;
  if (!mobileRepeatBug) {
    noteContent += transcript;
    noteTextarea.val(noteContent);
  }
};
let recognize = false;
recognition.onstart = function() {
  instructions.text(
    "Voice recognition activated. Try speaking into the microphone."
  );
  recognize = true;
  // readOutLoud("Voice recognition activated.Try speak");
};

recognition.onspeechend = function() {
  instructions.text(
    "You were quiet for a while so voice recognition turned itself off."
  );
  console.log("THE END");
};

recognition.onerror = function(event) {
  if (event.error == "no-speech") {
    instructions.text("No speech was detected. Try again.");
  }
};

/*-----------------------------
      App buttons and input
------------------------------*/
// $(window).delegate("*", "keypress", function(evt) {
//   alert("erm");
// });
// text analysis //

// let type = "";
// let score1, score2, data1, data2;
// const https = require("https");
// let accessKey = "4a98f14f888d4a28bfbd1a04da102374";
// let uri = "centralindia.api.cognitive.microsoft.com";
// let path = "/text/analytics/v2.0/";

let get = async function(documents) {};

//end of text analysis//
var i = -1;
$(document).keydown(function(e) {
  switch (e.which) {
    case 39:
      recognition.stop();
      // console.log(document.getElementById("note-textarea").innerHTML);
      if (i < 5) {
        if (!noteContent.length) {
          instructions.text(
            "Could not save empty note. Please add a message to your note."
          );
        } else {
          // Save note to localStorage.
          // The key is the dateTime with seconds, the value is the content of the note.
          console.log(noteContent);
          // documents["documents"][i + 1]["id"] = "" + i + 2;
          // documents["documents"][i + 1]["text"] = noteContent;

          documents.push(noteContent);

          // console.log(get_sentiment(documents));

          console.log(documents);
          saveNote(new Date().toLocaleString(), noteContent);

          // Reset variables and update UI.
          noteContent = "";
          renderNotes(getAllNotes());
          noteTextarea.val("");
        }
        i++;
        var message = questions["result"][i]["u_string_1"];
        // console.log(
        //   "%c" + questions["result"][i]["u_string_1"],
        //   "color:orange"
        // );
        // console.log("%c" + questions["result"][i]["u_string_2"], "color:blue");
        // console.log("%c" + documents, "color:blue");

        readOutLoud(message);
        // console.log(message);
        if (noteContent.length) {
          noteContent += " ";
        }
        document.getElementById("question").innerHTML = message;
        if (!recognize) recognition.start();
        // ans[i] = noteTextarea;
        // noteTextarea = "";
      } else {
        console.log(TextAnalytics(documents));
        // console.log("documents");
        // console.log("%c" + get_phrases(documents), "color: pink");
        // alert("Predicted Result" + result1)
      }

      break;
    case 37:
      if (i > 0) {
        i--;
        var message = questions["result"][i]["u_string_1"];
        readOutLoud(message);
        console.log(message);
        console.log("left"); //left arrow key
        if (noteContent.length) {
          noteContent += " ";
        }
        document.getElementById("question").innerHTML = message;
        if (!recognize) recognition.start();
      }
  }
});

// $("#start-record-btn").on("click", function(e) {
//   var message = questions["result"][i + 1]["u_string_1"];
//   document.getElementById("question").innerHTML = message;
//   readOutLoud(message);
//   if (noteContent.length) {
//     noteContent += " ";
//   }
//   recognition.start();
// });

$("#pause-record-btn").on("click", function(e) {
  recognition.stop();
  instructions.text("Voice recognition paused.");
});

// Sync the text inside the text area with the noteContent variable.
noteTextarea.on("input", function() {
  noteContent = $(this).val();
  console.log(noteContent);
});

$("#save-note-btn").on("click", function(e) {
  recognition.stop();

  if (!noteContent.length) {
    instructions.text(
      "Could not save empty note. Please add a message to your note."
    );
  } else {
    // Save note to localStorage.
    // The key is the dateTime with seconds, the value is the content of the note.
    saveNote(new Date().toLocaleString(), noteContent);

    // Reset variables and update UI.
    noteContent = "";
    renderNotes(getAllNotes());
    noteTextarea.val("");
    instructions.text("Note saved successfully.");
  }
});

notesList.on("click", function(e) {
  e.preventDefault();
  var target = $(e.target);

  // Listen to the selected note.
  if (target.hasClass("listen-note")) {
    var content = target
      .closest(".note")
      .find(".content")
      .text();
    readOutLoud(content);
  }

  // Delete note.
  if (target.hasClass("delete-note")) {
    var dateTime = target.siblings(".date").text();
    deleteNote(dateTime);
    target.closest(".note").remove();
  }
});

/*-----------------------------
      Speech Synthesis
------------------------------*/

function readOutLoud(message) {
  var speech = new SpeechSynthesisUtterance();

  // Set the text and voice attributes.
  speech.text = message;
  speech.volume = 2;
  speech.rate = 1;
  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
}

/*-----------------------------
      Helper Functions
------------------------------*/

function renderNotes(notes) {
  var html = "";
  if (notes.length) {
    notes.forEach(function(note) {
      html += `<li class="note">
        <p class="header">
          <span class="date">${note.date}</span>
          <a href="#" class="listen-note" title="Listen to Note">Listen to Note</a>
          <a href="#" class="delete-note" title="Delete">Delete</a>
        </p>
        <p class="content">${note.content}</p>
      </li>`;
    });
  } else {
    html = '<li><p class="content">You don\'t have any notes yet.</p></li>';
  }
  notesList.html(html);
}

function saveNote(dateTime, content) {
  localStorage.setItem("note-" + dateTime, content);
}

function getAllNotes() {
  var notes = [];
  var key;
  for (var i = 0; i < localStorage.length; i++) {
    key = localStorage.key(i);

    if (key.substring(0, 5) == "note-") {
      notes.push({
        date: key.replace("note-", ""),
        content: localStorage.getItem(localStorage.key(i))
      });
    }
  }
  return notes;
}

function deleteNote(dateTime) {
  localStorage.removeItem("note-" + dateTime);
}
