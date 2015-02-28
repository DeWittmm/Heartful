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
  }
}

function showSleepTile() {
  var toAppend = "<h1>Sleep Tile Stuff</h1>"
  toAppend += "<br><button onclick='goToHomePage()'>Home</button>"
  $("#tileDetail").empty().append(toAppend);
}

function showFitnessTile() {
  var toAppend = "<h1>Fitness Tile Stuff</h1>"
  toAppend += "<br><button onclick='goToHomePage()'>Home</button>"
  $("#tileDetail").empty().append(toAppend);
}

function showCaloriesTile() {
  var toAppend = "<h1>Metabolism Tile Stuff</h1>"
  toAppend += "<br><button onclick='goToHomePage()'>Home</button>"
  $("#tileDetail").empty().append(toAppend);
}

function showIntensityTile() {
  var toAppend = "<h1>Exercise Intensity Tile Stuff</h1>"
  toAppend += "<br><button onclick='goToHomePage()'>Home</button>"
  $("#tileDetail").empty().append(toAppend);
}

function showOtherUsersTile() {
  var toAppend = "<h1>Other Users Tile Stuff</h1>"
  toAppend += "<br><button onclick='goToHomePage()'>Home</button>"
  $("#tileDetail").empty().append(toAppend);
}

function goToHomePage() {
  $("#tileContent").css("display", "inherit");
  $(".jumbotron").css("display", "inherit");
  $("#tileDetail").empty();
}