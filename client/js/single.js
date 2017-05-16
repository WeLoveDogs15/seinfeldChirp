// Create an array to store user names
var users = [];

$(document).ready(function () {
    $.get("http://localhost:3000/api/users", function (data) {
        data.forEach(function (user) {
            users.push(user.name);
        })
    })
    $.get("http://localhost:3000/api" + window.location.pathname, function (data) {
        var thought = data[0];
        var dltBtn = $("<h2><button>Get out!</button></h2>");
        dltBtn.click(function () {
            $.ajax({
                method: "DELETE",
                url: "http://localhost:3000/api" + window.location.pathname
            }).done(function(data) {
                window.location.href = "http://localhost:3000/thoughts";
            })
        })
          $(".singleft").append(
            $("<h2>User: " + users[thought.userid - 1] + "</h2>"),
            $("<h2>Message: " + thought.message + "</h2>"),
            $("<h2><button><a href='" + window.location.pathname + "/update'>Edit!</a></button></h2>"),
            $(dltBtn)
        );
    })
})
