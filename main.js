const io = require("socket.io");
const $ = require("jquery");
let name = "Andrew";
let socket = io();

$("#nameForm").submit((e) => {
  e.preventDefault();
  socket.emit("change name", { oldName: name, newName: $("#nameM").val() });
  name = $("#nameM").val();
  $("#nameM").val("");
  return false;
});

$("#mForm").submit(function (e) {
  e.preventDefault(); // prevents page reloading
  socket.emit("chat message", $("#m").val());
  $("#m").val("");
  return false;
});

socket.on("change name", function (obj) {
  $("#messages").append(
    $("<li>").text(`${obj.oldName} has changed their name to ${obj.newName}`)
  );
});

socket.on("chat message", function (msg) {
  $("#messages").append($("<li>").text(msg));
});
