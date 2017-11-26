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

/* Load lists from storage */
loadWebsites();
document.getElementById("addingInput").addEventListener("keypress", addCustomWebsite);

/* HTML templates */
let tableHead = '<tr>' +
                  '<th>Website</th>' +
                '</tr>';

let tableElementTemplate = '<tr id="{{ id }}">' +
                              '<td class="table-checkbox">' +
                                '<input type="checkbox" class="checkbox" {{ checked }}>' +
                              '</td>' +
                              '<td>{{ el }}</td>' +
                              '<td  class="table-cross disable-select">x</td>' +
                            '</tr>';

/* Fill a template with the data dictionnary passed */
function fillTemplate(template, data){
  let result = template;

  for(let el in data){
    let mark = "{{ " + el + " }}";
    result = result.replace(mark, data[el]);
  }

  return result;
}

/* Load the default and custom list from chrome storage */
function loadWebsites(){
  storage.local.get(["defaultWebsites", "customWebsites"], function(items){
    /* Default websites loading */
    if(items.defaultWebsites !== undefined){
      let defaults = items.defaultWebsites;
      let list = document.getElementById("defaultList");
      list.innerHTML = "";

      for(let index in defaults){
        let website = defaults[index];
        let checked = website.on ? "checked" : "";
        let element = fillTemplate(listElementTemplate, {"id": "default"+index, "el": website.url, "checked": checked});

        list.innerHTML += element;
      }
    }

    if(items.customWebsites !== undefined){
      let customWebsites = items.customWebsites;
      let table = document.getElementById("customTable");
      table.innerHTML = tableHead;

      for(let index in customWebsites){
        let website = customWebsites[index];
        let checked = website.on ? "checked" : "";
        let element = fillTemplate(tableElementTemplate, {"id": "custom"+index, "el": website.url, "checked": checked});

        table.innerHTML += element;
      }

      attachEvents();
    }
  });
}

function toogleDefaultElement(e){
  let id = this.parentElement.parentElement.id.replace("default", "");
  let checked = this.checked;

  storage.local.get("defaultWebsites", function(items){
    if(items.defaultWebsites !== undefined){
      items.defaultWebsites[id].on = checked;

      storage.local.set({"defaultWebsites": items.defaultWebsites});
    }
  });
}

function toogleCustomElement(e){
  let id = this.parentElement.parentElement.id.replace("custom", "");
  let checked = this.checked;

  storage.local.get("customWebsites", function(items){
    if(items.customWebsites !== undefined){
      items.customWebsites[id].on = checked;

      storage.local.set({"customWebsites": items.customWebsites});
    }
  });
}

function addCustomWebsite(e){
  if(e.keyCode === 13){
    let input = document.getElementById("addingInput");

    if(input.value.length === 0){
      return;
    }

    storage.local.get("customWebsites", function(items){
      if(items !== undefined){
        let array = items.customWebsites;

        array.push({"url": input.value, "on": true});

        storage.local.set({"customWebsites": array}, function(){
          loadWebsites();
        });

        input.value = "";
      }
    });
  }
}

function deleteCustomWebsite(e){
  let id = this.parentElement.id.replace("custom", "");

  storage.local.get("customWebsites", function(items){
    if(items.customWebsites !== undefined){
      let newArray = items.customWebsites;
      newArray.splice(id, 1);

      storage.local.set({"customWebsites": newArray}, function(){
        loadWebsites();
      });
    }
  });
}

function attachEvents(){
  /* Deleting event */
  let crosses = document.getElementsByClassName("table-cross");

  /* Skip the first element because we don't want to affect the first line */
  for(let i = 1; i < crosses.length; i++){
    crosses.item(i).addEventListener("click", deleteCustomWebsite);
  }

  /* Checking event */
  let defaultCheckboxes = document.getElementById("defaultList").getElementsByClassName("checkbox");

  for(i = 0; i < defaultCheckboxes.length; i++){
    defaultCheckboxes.item(i).addEventListener("change", toogleDefaultElement);
  }

  let customCheckboxes = document.getElementById("customTable").getElementsByClassName("checkbox");

  for(i = 0; i < customCheckboxes.length; i++){
    customCheckboxes.item(i).addEventListener("change", toogleCustomElement);
  }
}
