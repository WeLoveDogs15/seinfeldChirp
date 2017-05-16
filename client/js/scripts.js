var users = [];

$(document).ready(function () {
    $.get("http://localhost:3000/api/users", function (data) {
        for (var i = 0; i < data.length; i++) {
            users.push(data[i].name);
            $("#users-list").append($("<option value='" + data[i].id + "'>" + data[i].name + "</option>"));
        }
    });

    $.get("http://localhost:3000/api/thoughts", function (data) {
        for (var i = 0; i < data.length; i++) {
            createDiv(data[i], data[i].id);
        }
    });

    $("#thought-input").keyup(function () {
        var isEmpty = $("#thought-input").val().length === 0;
        $("#thought-button").prop("disabled", isEmpty);
    });
    //CREATE AN EVENT LISTENER THAT LISTENS FOR THE BUTTON BEING CLICKED
    $("#thought-button").click(function () {
        postThought();
        $("#thought-input").val('');
    });
});

function postThought() {
    var thought = {
        message: $("#thought-input").val(),
        userid: $("#users-list").val(),
        TIME: (new Date()).toISOString().substring(0, 19).replace('T', ' ')
    };


 $.ajax({
        method: "POST",
        url: "http://localhost:3000/api/thoughts",
        contentType: "application/json",
        data: JSON.stringify(thought)
    }).then(function(data) {
        console.log(data);
        createDiv(thought, data[0].id);
    }, function (err) {
        console.log(err);
    });
}

var array = [];
var counter = 0;

//FUNCTION TO CREATE A NEW DIV WITH STYLED CHIRP
function createDiv(thought, id) {
    counter = counter + 1 >= array.length ? 0 : counter + 1;
    var container = $("<li class='list-group-item list-group-item-" + array[counter] + "'></li>");
    //GO TO THE SINGLE_VIEW WHEN THE CHIRP IS CLICKED
    container.click(function() {
        window.location.href = "http://localhost:3000/thoughts/" + id
    })
    var heading = $("<h4>" + users[thought.userid - 1] + "</h4>");
    var message = $("<p>" + thought.message + "</p>");
    var date = $("<p>" + thought.TIME + "</p>");
    container.attr('id', id);
    container.append(heading);
    container.append(message);
    container.append(date);
    
    $("#thought-container").append(container);
}

