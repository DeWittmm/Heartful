var baseUrl = "http://52.10.162.213/"
var user = { userName : "", userId : "" }

// Load the Visualization API library and the piechart library.
google.load('visualization', '1.0', {'packages':['corechart']});
google.setOnLoadCallback(drawAllHRDataChart);

function drawAllHRDataChart () {
     // Create the data table.
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Topping');
      data.addColumn('number', 'Slices');
      data.addRows([
        ['Mushrooms', 3],
        ['Onions', 1],
        ['Olives', 1], 
        ['Zucchini', 1],
        ['Pepperoni', 2]
      ]);

      // Set chart options
      var options = {'title':'How Much Pizza I Ate Last Night',
                     'width':400,
                     'height':300};

      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
      chart.draw(data, options);
}
   // ... draw the chart...

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

  //do a get call to load some amount of the data
  var myDataUrl = baseUrl + "myData/" + user.userId

  $.ajax({
    type: "GET",
    url: myDataUrl
  }).done(function(result) {
    console.log("got some data")
  }).fail(function(error){
    console.log("could not get myData")
    console.log(error)
  });   




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

  //do a get call to load data about all the users
  var allDataUrl = baseUrl + "userData" 

  $.ajax({
    type: "GET",
    url: allDataUrl
  }).done(function(result) {
    console.log("got some data")
  }).fail(function(error){
    console.log("could not get all user data")
    console.log(error)
  });  


  var toAppend = "<h1>Other Users Tile Stuff</h1>";
  toAppend += "<br><button onclick='goToHomePage()'>Home</button>";
  $("#tileDetail").empty().append(toAppend);
}

function goToHomePage() {
  $("#tileContent").css("display", "inherit");
  $(".jumbotron").css("display", "inherit");
  $("#tileDetail").empty();
}

function submitManualData() {
  var hr = $("#manualEntryHR").val();
  var spo2 = $("#manualEntrySPO2").val();
  var date = $("#manualEntryDate").val();
  var tag = $("#manualEntryTag").val();

  var json = { "userId" : user.userId, "day" : date, "tag" : tag, "HR" : hr, "SPO2" : spo2 };
  var manualDataUrl = baseUrl + "userData";

  $.ajax({
    type: "POST",
    url: manualDataUrl,
    data: json
  }).done(function(result) {
      $("#manualEntryHR").val("");
      $("#manualEntrySPO2").val("");
      $("#manualEntryDate").val("");
      $("#manualEntryTag").val("");
      $("#manualDataEntryModal").toggle();
  }).fail(function(result) {
    console.log("failed to upload data manually")
  });

  console.log(hr + " " + spo2)
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
              $("#googleSignInButton").css("display", "none");
              $("#userName").append("<p>" + user.userName + "</p>");
            });
        });
    } else {
        console.log('Sign-in state: ' + authResult['error']);
    }
}

