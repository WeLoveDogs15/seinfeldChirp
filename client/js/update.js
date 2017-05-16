var users = [];

$(document).ready(function () {
    var id = window.location.pathname.split("/")[2];
    var message = "Was that wrong?";
    message.split(" ");

    $.get("http://localhost:3000/api/users", function (data) {
        data.forEach(function (user) {
            users.push(user.name);
        })
    })
    $.get("http://localhost:3000/api/thoughts/" + id, function (data) {
        var thought = data[0];
        var upBtn = $("<button>Update</button>");
        upBtn.click(function () {
            var obj = {
                message: $("#message").val()
            }
            $.ajax({
                method: "PUT",
                url: "http://localhost:3000/api/thoughts/" + id,
                data: JSON.stringify(obj),
                contentType: "application/json"

            }).then(function () {
                console.log("Herpaderp");
                window.location.href = "http://localhost:3000/thoughts"
            })
        })
        $(".bodcen").append(
            $("<h1>User: " + users[thought.userid - 1] + "</h1>"),
            $("<input id='message' type='text'></input>").val(thought.message),
            upBtn
        )
    });
});