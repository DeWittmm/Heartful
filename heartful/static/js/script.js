var remoteUrl = "http://52.10.162.213/";
var localUrl = "http://127.0.0.1:8000/";
var baseUrl = localUrl;
var user = { userName : "", userId : "", age : "" };

var myHRData;

// Load the Visualization API library and the piechart library.
google.load('visualization', '1.0', {'packages':['corechart']});
// google.setOnLoadCallback(drawAllHRDataChart);

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
  //allow for manual entry

  //do a get call to load some amount of the data
  var myDataUrl = baseUrl + "dataSet/entries/28/" + user.userId;

  $.ajax({
    type: "GET",
    url: myDataUrl
  }).done(function(result) {
    console.log("got some data");
    myHRData = result;
    drawAHRGraph("#myDataChart", "#myHRDataTable", "My Heart Rate", myHRData);
  }).fail(function(error){
    console.log("could not get myData");
    console.log(error);
  });   


  var toAppend = "<button onclick='goToHomePage()'>&#10096; Home</button>"; 
  toAppend += "<h1>My Health Data</h1>";
  toAppend += '<button type="submit" style="margin-left: 70%;" class="btn btn-success" data-toggle="modal" data-target="#manualDataEntryModal">Enter New Data</button>';
  toAppend += '<br><div class="btn-group" role="group" aria-label="..."><button type="button" onclick="showMyHRDataGraph()" id="myHRDataGraphBtn" class="btn active btn-default">Graph</button><button type="button" onclick="showMyHRDataTable()" id="myHRDataTableBtn" class="btn btn-default">Table</button></div>'
  toAppend += '<div id="myDataChart" class="barGraph"></div>';
  toAppend += "<div id='myHRDataTable'></div>"
  
  $("#tileDetail").empty().append(toAppend);
}

function showMyHRDataTable() {
  $("#myHRDataTableBtn").addClass("active")
  $("#myHRDataGraphBtn").removeClass("active")

  drawATable("#myHRDataTable", "#myDataChart", myHRData);
}

function showMyHRDataGraph() {
  $("#myHRDataTableBtn").removeClass("active")
  $("#myHRDataGraphBtn").addClass("active")

  drawAHRGraph("#myDataChart", "#myHRDataTable", "My Heart Rate", myHRData);
}

function drawATable(activate, deactivate, dataSource) {
  $(deactivate).css("display", "none");
  $(activate).css("display", "inline");
  
  var toAppend = "<div class='table-responsive'>";
  toAppend += '<table class="table table-striped">';
  toAppend += '<thead style="display: table-header-group;"><tr><th>Date</th><th>Heart Rate (bpm)</th></tr></thead>';
  toAppend += '<tbody>';

  var json = dataSource;

  for (i = 0; i < json.length; i++) {
    var date = dateCleaner(json[i]["date_time"]);
    var value = json[i]["value"];
    toAppend += '<tr><td>' + date + '</td><td>' + value + '</td></tr>'
  }

  toAppend += "</tbody></table></div>";
  $(activate).empty().append(toAppend);
}

function drawAHRGraph(activate, deactivate, title, dataSource) {
  $(activate).css("display", "inline");
  $(deactivate).css("display", "none");  
  

  var data = new google.visualization.DataTable();

  data.addColumn('string', 'Date');
  data.addColumn('number', 'HR (bpm)');

  var json = dataSource;

  for (i = 0; i < json.length; i++) {
    var date = dateCleaner(json[i]["date_time"]);
    var value = json[i]["value"];
    data.addRows([ 
      [date, value]
    ]);
  }

  var options = {'title': title, 'width':800, 'height':500};

  //call draw() again for the chart
  var chart = new google.visualization.ColumnChart($(activate)[0]);
  chart.draw(data, options);
}


function showSleepTile() {
  var toAppend = "<button onclick='goToHomePage()'>&#10096; Home</button>";
  toAppend += "<br><h1>Sleep Tile Stuff</h1>";
  
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

    console.log(result);


  });   

      var toAppend = "<button onclick='goToHomePage()'>&#10096; Home</button>";
    // toAppend += "<br><p>Baseline Heart Rate: " + userFitness.baselineHR + "</p><br><p>Target Heart Rate: " + userFitness.targetHR + "</p>"  
    toAppend += "<br><h1>Fitness Tile Stuff</h1>";


    $("#tileDetail").empty().append(toAppend);

  
}

function showCaloriesTile() {
  var toAppend = "<button onclick='goToHomePage()'>&#10096; Home</button>";
  toAppend += "<br><h1>Metabolism Tile Stuff</h1>";
  $("#tileDetail").empty().append(toAppend);
}

function showIntensityTile() {
  var lowTargetHR = 50;
  var highTargetHR = 175;
  var maxHR = 200;

  var targetHRRangeUrl = baseUrl + "targetHR";
  var targetAge = { targetAge : user.age };

  $.ajax({
    type: "GET",
    url: targetHRRangeUrl,
    data: targetAge
  }).done(function(result) {
    console.log("got some data");

    lowTargetHR = result["low"];
    highTargetHR = result["high"];
    maxHR = result["max"];

  }).fail(function(error){
    console.log("could not get all user data");
    console.log(error);
  }); 


  var toAppend = "<button onclick='goToHomePage()'>&#10096; Home</button>";
  toAppend += "<br><h1>Target Exercise Intensities</h1>";
  toAppend += "<br><h4><b>Lower Heart Rate Target:</b> " + lowTargetHR + " bpm</h4>";
  toAppend += "<br><h4><b>Upper Heart Rate Target:</b> " + highTargetHR + " bpm</h4>";
  toAppend += "<br><h4><b>Max Heart Rate:</b> " + maxHR + " bpm</h4>";
  toAppend += "<br><div id='exerciseIntensityRangeTbl'><div>";

  $("#tileDetail").empty().append(toAppend);

  showExerciseIntensityTable();
}

function showExerciseIntensityTable() {
  //create table

  var toAppend = "<div class='table-responsive'>";
  toAppend += '<table class="table table-striped">';
  toAppend += '<thead style="display: table-header-group;"><tr><th>Intensity</th><th>Heart Rate Range</th></tr></thead>';
  toAppend += '<tbody>';

  for (i = 0; i < 5; i++) {
    toAppend += '<tr><td>' + i + '</td><td>' + i + '</td></tr>'
  }

  toAppend += "</tbody></table></div>";
  $("#exerciseIntensityRangeTbl").empty().append(toAppend);
}

function showOtherUsersTile() {

  //do a get call to load data about all the users
  var allDataUrl = baseUrl + "dataSet/entries/" 

  $.ajax({
    type: "GET",
    url: allDataUrl
  }).done(function(result) {
    console.log("got some data")
    allHRData = result;
    drawAHRGraph("#allHRDataGraph", "#allHRDataTable", "All Heart Rate Data", allHRData);
  }).fail(function(error){
    console.log("could not get all user data")
    console.log(error)
  });  


  var toAppend = "<button onclick='goToHomePage()'>&#10096; Home</button>";
  toAppend += "<br><h1>All Heartful Users' Data</h1>";
  toAppend += '<br><div class="btn-group" role="group" aria-label="..."><button type="button" onclick="showAllHRDataGraph()" id="allHRDataGraphBtn" class="btn active btn-default">Graph</button><button type="button" onclick="showAllHRDataTable()" id="allHRDataTableBtn" class="btn btn-default">Table</button></div>'
  toAppend += "<div id='allHRDataGraph'></div>"
  toAppend += "<div id='allHRDataTable'></div>"

  $("#tileDetail").empty().append(toAppend);
}

function showAllHRDataTable() {
  $("#allHRDataTableBtn").addClass("active")
  $("#allHRDataGraphBtn").removeClass("active")

  drawATable("#allHRDataTable", "#allHRDataGraph", allHRData);
}

function showAllHRDataGraph() {
  $("#allHRDataGraphBtn").addClass("active")
  $("#allHRDataTableBtn").removeClass("active")

  drawAHRGraph("#allHRDataGraph", "#allHRDataTable", "All Heart Rate Data", allHRData);
}

function goToHomePage() {
  $("#tileContent").css("display", "inherit");
  $(".jumbotron").css("display", "inherit");
  $("#tileDetail").empty();
}


//TODO: Doesn't seem to work!  The /dataSet url accepts the example data on github documentation, but not user entered data -- detail not found 
function submitManualData() {
  var hr = $("#manualEntryHR").val();
  var date = $("#manualEntryDate").val();
  var type = $("#manualEntryType").val();
  var id = 28;

  var json = { "googleid" : id, "type" : type, "heartrate_values" : [{ "value" : hr, "unit" : "bpm", "date_time" : date }] };
  var manualDataUrl = baseUrl + "dataSet";

  $.ajax({
    type: "POST",
    url: manualDataUrl,
    data: json
  }).done(function(result) {
      $("#manualEntryHR").val("");
      $("#manualEntryDate").val("2009-07-24 21:45:34-07");
      $("#manualEntryTag").val("sitting");
      $("#manualDataEntryModal").toggle();
  }).fail(function(result) {
    console.log("failed to upload data manually")
  });
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

function dateCleaner(date) {
  var cleanDate = new Date(date);
  return "" + (cleanDate.getMonth() + 1) + "/" + cleanDate.getDate() + "/" + cleanDate.getFullYear();
}