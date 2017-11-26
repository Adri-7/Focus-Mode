/*******************************************************************************
Copyright (C) 2015 Adrien Coppola

This file is part of Focus Mode.

Focus Mode is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Focus Mode is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Focus Mode.  If not, see <http://www.gnu.org/licenses/>.
*******************************************************************************/

let storage = chrome.storage;

/* Update the value of the button */
function updateOnButton(){
  let onButton = document.getElementById("onButton");

  storage.local.get("on", function(item){
    if(item.on === true){
      onButton.innerText = "Deactivate";
    }
    else {
      onButton.innerText = "Activate";
    }
  });
}

/* Update icon to show the extension state */
function updateIcon(){
  storage.local.get("on", function(item){
    if(item.on === true){
      chrome.browserAction.setIcon({"path": "../images/icon128-2.png"});
    }
    else {
      chrome.browserAction.setIcon({"path": "../images/icon128-1.png"});
    }
  });
}

/* Activate or Deactivate the work mode */
function onButtonClick(){
  storage.local.get(["on", "blocked"], function(item){
    let on;

    if(item.on === undefined || item.on === false){
      on = true;
      startStopwatch();
    }
    else {
      on = false;
    }

    storage.local.set({"on": on, "blocked": 0});

    updateOnButton();
    updateIcon();
  });
}

/* Open the options tab */
function optionsButtonClick(){
  chrome.tabs.create({"url": "html/settings.html"});
}

/* update the number of attempts */
function updateAttempts(){
  let nbAttempts = 0;

  storage.local.get("blocked", function(item){
    if(item.blocked !== undefined){
      nbAttempts = item.blocked;
    }

    let number = document.getElementsByTagName("number")[0];
    number.innerText = nbAttempts;
  });
}

/* store starting time */
function startStopwatch(){
  let start = Date.now();

  storage.local.set({ "startedTime": start });

  setInterval(function(){
    updateStopwatch();
  }, 1000);
}

/* function to update stopwatch in the view */
function updateStopwatch(){
  storage.local.get(["startedTime", "on"], function(items){
    let stopwatch = document.getElementById("stopwatch");

    if(items.on && items.startedTime){
      stopwatch.innerText = formatStopwatch(Date.now() - items.startedTime);
    } else {
      stopwatch.innerText = "00:00:00";
    }
  });
}

function formatStopwatch(value){
  let hours, minutes, seconds;

  /* Split milliseconds into hours, minutes and seconds */
  hours = Math.floor(value / 3600000);
  value = value % 3600000;
  minutes = Math.floor(value / 60000);
  value = value % 60000;
  seconds = Math.floor(value / 1000);

  /* Format the resulting string */
  let result = (hours < 10) ? ("0" + hours) : hours;
  result += ":";
  result += (minutes < 10) ? ("0" + minutes) : minutes;
  result += ":";
  result += (seconds < 10) ? ("0" + seconds) : seconds;

  return result;
}

//Update on each popup openning
updateAttempts();
updateOnButton();
updateIcon();
updateStopwatch();

storage.local.get("on", function(items){
  if(items.on){
    setInterval(function(){
      updateStopwatch();
    }, 1000);
  }
});

/* Attach onclick functions */
let onButton = document.getElementById("onButton");
let optionsButton = document.getElementById("optionsButton");

onButton.addEventListener("click", onButtonClick);
optionsButton.addEventListener("click", optionsButtonClick);
