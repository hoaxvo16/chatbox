var socket = io("https://hoavochatroom.herokuapp.com/");

socket.on("username-taken", function () {
  alert("username-taken!!!!");
});

socket.on("success-login", function (data) {
  $("#hello-user").html(data);
  $(".login-box").hide();
  $("#chat-div").show();
});

socket.on("login-event", function (data) {
  $("#log-mess").append(
    "<div class='log-display'> <i style='font-size:14px' class='fa'>&#xf105;</i>" +
      data +
      " joined</div>"
  );
});

socket.on("logout-event", function (data) {
  $("#log-mess").append(
    "<div class='log-display'> <i style='font-size:14px' class='fa'>&#xf105;</i>" +
      data +
      " leaved</div>"
  );
});

socket.on("user-online-list", function (data) {
  $("#online-user").html("");
  data.forEach(element => {
    $("#online-user").append(
      "<div class='current-user'> <i style='font-size: 14px; color: chartreuse;' class='fas'>&#xf111;</i>" +
        element +
        "</div>"
    );
  });
});

socket.on("sbd-logout", function (data) {
  $("#online-user").html("");
  data.forEach(element => {
    $("#online-user").append(
      "<div class='current-user'><i style='font-size: 14px; color: chartreuse;' class='fas'>&#xf111;</i>" +
        element +
        "</div>"
    );
  });
});

socket.on("server-send-mess", function (data) {
  $("#chat-box").append(
    "<div class='mess'><i style='font-size:14px' class='fa'>&#xf105;</i><b>" +
      data.usn +
      "</b>: " +
      data.mess +
      "</div>"
  );
});

$(document).ready(function () {
  $(".login-box").show();
  $("#chat-div").hide();

  $("#signIn").click(function () {
    socket.emit("username-send", $("#usn").val());
  });

  $("#log-out").click(function () {
    socket.emit("logout");
    $("#chat-div").hide();
    $(".login-box").show();
  });

  $("#send-btn").click(function () {
    socket.emit("user-send-mess", $("#chat-mess").val());
    $("#chat-mess").val("");
  });

  $("#chat-mess").bind("enterKey", function (e) {
    socket.emit("user-send-mess", $("#chat-mess").val());
    $("#chat-mess").val("");
  });

  $("#chat-mess").keyup(function (e) {
    if (e.keyCode == 13) {
      $(this).trigger("enterKey");
    }
  });
});
