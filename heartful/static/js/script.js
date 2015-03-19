var remoteUrl = "http://52.10.162.213/";
var localUrl = "http://127.0.0.1:8000/";
var baseUrl = remoteUrl;
var googleid;

var myHRData;

// Load the Visualization API library and the piechart library.
google.load('visualization', '1.0', {'packages':['corechart']});

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
  var myDataUrl = baseUrl + "dataSet/entries/id/" + googleid + "/";

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
  setTimeout(showMyDataTile, 5 * 1000);
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
  var toAppend = "<button onclick='goToHomePage()'>&#10096; Home</button>";
  toAppend += "<br><h1>Fitness Tile Stuff</h1>";
  toAppend += '<button type="submit" style="margin-left: 70%;" class="btn btn-success" data-toggle="modal" data-target="#newFitnessGoalModal">Enter New Fitness Goal</button>';
  toAppend += "<div class='masonry' id='fitnessMasonry'></div>";

  $("#tileDetail").empty().append(toAppend);

  var fitnessUrl = baseUrl + "fitness/";

  $.ajax({
    type: "GET",
    url: fitnessUrl
  }).done(function(result) {
    createFitnessTiles(result);
  });
}

function submitNewGoal() {
  var fitnessUrl = baseUrl + "fitness/";

  var title = $("#goalName").val();
  var detail = $("#goalDetail").val();
  var importance = $("#goalImportance").val();

  var fitnessData = { "googleId" : googleid, "title" : title, "detail" : detail, "status" : "active", "importance" : importance };
  var json = JSON.stringify(fitnessData);

  $.ajax({
    type: "POST",
    url: fitnessUrl,
    data: json,
    contentType: "application/json"
  }).done(function(result) {
    console.log("successful submit of new goal");
    $("#goalName").val("");
    $("#goalDetail").val("");
    $("#goalImportance").val("");
    $("#newFitnessGoalModal").toggle();
    createFitnessTiles(result);
  });
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

  var targetHRRangeUrl = baseUrl + "analysis/";
  var targetAge = { age : 22 };

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

  showExerciseIntensityTable(lowTargetHR, highTargetHR);
}

function showExerciseIntensityTable(lowTargetHR, highTargetHR) {
  //create table

  var toAppend = "<div class='table-responsive'>";
  toAppend += '<table class="table table-striped">';
  toAppend += '<thead style="display: table-header-group;"><tr><th>Intensity</th><th>Heart Rate Range</th></tr></thead>';
  toAppend += '<tbody>';

  toAppend += '<tr><td>Gentle Walking</td><td>' + lowTargetHR + '</td></tr>'
  toAppend += '<tr><td>Low Intensity Exercise</td><td>' + (lowTargetHR + 30) + '</td></tr>'
  toAppend += '<tr><td>Moderate Intensity Exercise</td><td>' + (highTargetHR - 30) + '</td></tr>'
  toAppend += '<tr><td>High Intensity Exercise</td><td>' + (highTargetHR + 10) + '</td></tr>'


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

  var hrData = { "googleid" : googleid, "type" : type, "heartrate_values" : [{ "value" : hr, "unit" : "bpm", "date_time" : date }] };
  var json = JSON.stringify(hrData);
  var manualDataUrl = baseUrl + "dataSet/";

  $.ajax({
    type: "POST",
    url: manualDataUrl,
    data: json,
    contentType: "application/json"
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
        userName = resp.displayName;
        googleid = resp.result.id;

        //hide sign in button and show name instead
        $("#googleSignInButton").css("display", "none");
        $("#userName").append("<p style='color : white; margin-left : 70%'>Welcome " + userName + "</p>");

        if (googleid != null) {
          var aUrl = baseUrl + "user/"

          $.ajax({
            type: "GET",
            url: aUrl,
            contentType: "application/json"
          }).done(function(result) {
            var found = false;
            for (var i = 0; i < result.length; i++) {
              if (result[i]["googleid"] == googleid) {
                found = true;
                break;
              }
            }
            if (!found) {
              createUser();
            }

          }).fail(function(result) {
            console.log("failed to upload new user")
          });
        }

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

function submitNewUser() {
  //post the user stuff, then do the google auth to get the google id

  var name = $("#nameEntry").val();
  var hr = $("#hrEntry").val();
  var o2 = $("#o2Entry").val();
  var age = $("#ageEntry").val();

  var userData = { "googleid" : googleid, "name" : name, "heartrate" : hr, "spO2" : o2, "age" : age };
  var json = JSON.stringify(userData);
  var newUserUrl = baseUrl + "user/";

  $.ajax({
    type: "POST",
    url: newUserUrl,
    data: json,
    contentType: "application/json"
  }).done(function(result) {
    $("#nameEntry").val("");
    $("#hrEntry").val("");
    $("#o2Entry").val("");
    $("#ageEntry").val("");
    $("#newUserModal").toggle();
  }).fail(function(result) {
    console.log("failed to upload new user")
  });

}

function getItemElement(goal) {
  var elem = document.createElement('div');
  var importance = 2 * goal["importance"]  + 10;

  console.log("import: " + importance)

  var wRand = Math.random();
  var hRand = Math.random();
  if (importance > 18) {
    wRand = 0.95;
    hRand = 0.95;
  } else if (importance < 14) {
    wRand = 0.5;
    hRand = 0.3;
  }
  var widthClass = wRand > 0.92 ? 'w4' : wRand > 0.8 ? 'w3' : wRand > 0.6 ? 'w2' : '';
  var heightClass = hRand > 0.85 ? 'h4' : hRand > 0.6 ? 'h3' : hRand > 0.35 ? 'h2' : '';

  elem.className = 'item ' + widthClass + ' ' + heightClass;
  var inner = "<div class='masonryPadding'><p style='font-size : " + importance + "px;'>" + goal["title"] + "</h3><br><p style='font-size : " + importance + "px;'>" + goal["detail"] + "</p></div>"

  elem.innerHTML = inner;
  return elem;
}

function createFitnessTiles(data) {
  var container = document.querySelector('#fitnessMasonry');
  var msnry = new Masonry( container, {
    columnWidth: 200
  });

  if (data != null && !data.length) {
    var elems = [];
    var fragment = document.createDocumentFragment();
    var elem = getItemElement(data);
    fragment.appendChild( elem );
    elems.push( elem );
    container.appendChild( fragment );
    msnry.appended( elems );
    msnry.layout();
  } else {
    for (i = 0; i < data.length; i++) {
      var elems = [];
      var fragment = document.createDocumentFragment();
      for ( var i = 0; i < data.length; i++ ) {
        var elem = getItemElement(data[i]);
        fragment.appendChild( elem );
        elems.push( elem );
      }

      container.appendChild( fragment );
      msnry.appended( elems );
    }
  }



  eventie.bind( container, 'click', function( event ) {
    // don't proceed if item was not clicked on
    if ( !classie.has( event.target, 'item' ) ) {
      return;
    }
    // remove clicked element
    msnry.remove( event.target );
    // layout remaining item elements
    msnry.layout();
  });
}






/*!
 * classie v1.0.1
 * class helper functions
 * from bonzo https://github.com/ded/bonzo
 * MIT license
 *
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, module: false */

( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}

var classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = classie;
} else {
  // browser global
  window.classie = classie;
}

})( window );
