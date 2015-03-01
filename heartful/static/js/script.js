var baseUrl = "http://52.10.162.213/"
var user = { userName : "", userId : "" }

function showTile(tileName) {
  $("#tileContent").css("display", "none");
  $(".jumbotron").css("display", "none");

  switch (tileName) {
    case  "sleep":
      showSleepTile();
      break;
    case "fitness":
      showFitnessTile();
      break;
    case "calories":
      showCaloriesTile()
      break;
    case "intensity":
      showIntensityTile();
      break;
    case "otherUsers":
      showOtherUsersTile();
      break;
    case "myData":
      showMyDataTile();
      break;
  }
}

function createUser () {
  $('#newUserModal').modal();
}

function showMyDataTile() {
  //create a large table for the user to view all of their data

  //allow for manual entry

  var toAppend = "<h1>My Health Data</h1>";
  toAppend += '<button type="submit" class="btn btn-success" data-toggle="modal" data-target="#manualDataEntryModal">Enter New Data</button>'
  toAppend += "<br><button onclick='goToHomePage()'>Home</button>";
  $("#tileDetail").empty().append(toAppend);
}

function showSleepTile() {
  var toAppend = "<h1>Sleep Tile Stuff</h1>";
  toAppend += "<br><button onclick='goToHomePage()'>Home</button>";
  $("#tileDetail").empty().append(toAppend);
}

function showFitnessTile() {
  //var fitnessUrl = baseUrl + "fitness/" + user.userId;
  var fitnessUrl = baseUrl + "test";
  var fitnessData = {};

  $.ajax({
    type: "GET",
    url: fitnessUrl,
    data: fitnessData
  }).done(function(result) {
    //want to get things like target HR and baseline HR

    console.log(result)

    var toAppend = "<h1>Fitness Tile Stuff</h1>";
    // toAppend += "<br><p>Baseline Heart Rate: " + userFitness.baselineHR + "</p><br><p>Target Heart Rate: " + userFitness.targetHR + "</p>"  
    toAppend += "<br><button onclick='goToHomePage()'>Home</button>";


    $("#tileDetail").empty().append(toAppend);
  });   

  
}

function showCaloriesTile() {
  var toAppend = "<h1>Metabolism Tile Stuff</h1>"
  toAppend += "<br><button onclick='goToHomePage()'>Home</button>";
  $("#tileDetail").empty().append(toAppend);
}

function showIntensityTile() {
  var toAppend = "<h1>Exercise Intensity Tile Stuff</h1>";
  toAppend += "<br><button onclick='goToHomePage()'>Home</button>";
  $("#tileDetail").empty().append(toAppend);
}

function showOtherUsersTile() {
  var toAppend = "<h1>Other Users Tile Stuff</h1>";
  toAppend += "<br><button onclick='goToHomePage()'>Home</button>";
  $("#tileDetail").empty().append(toAppend);
}

function goToHomePage() {
  $("#tileContent").css("display", "inherit");
  $(".jumbotron").css("display", "inherit");
  $("#tileDetail").empty();
}


function signinCallback(authResult) {
    if (authResult['status']['signed_in']) {
        gapi.client.load('plus','v1', function() {
            var request = gapi.client.plus.people.get({
               'userId': 'me'
            });
            request.execute(function(resp) {
              user.userName = resp.displayName;
              user.userId = resp.result.id;
              console.log(user.userName + " " + user.userId);

              //hide sign in button and show name instead
              $("#googleSignInButton").css("display" : "none");
              $("#userName").append("<p>" + user.userName + "</p>");
            });
        });
    } else {
        console.log('Sign-in state: ' + authResult['error']);
    }
}

