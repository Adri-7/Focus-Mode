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

(function(){
  var storage = chrome.storage;

  var listElementTemplate = '<li id="{{ id }}" class="list__item">' +
                                '<label class="label--checkbox">' +
                                  '<input type="checkbox" class="checkbox" {{ checked }}>' +
                                  '{{ el }}' +
                                '</label>' +
                              '</li>';

  var tableHead = '<tr class="head">' +
                    '<th class="table-checkbox">' +
                    '&#10004;</th>' +
                    '<th>Website</th>' +
                    '<th class="table-cross">Delete</th>' +
                  '</tr>';

  var tableElementTemplate = '<tr id="{{ id }}">' +
                                '<td class="table-checkbox">' +
                                  '<input type="checkbox" class="checkbox" {{ checked }}>' +
                                '</td>' +
                                '<td>{{ el }}</td>' +
                                '<td  class="table-cross disable-select">x</td>' +
                              '</tr>';

  /* Fill a template with the data dictionnary passed*/
  function fillTemplate(template, data){
    var result = template;

    for(var el in data){
      var mark = "{{ " + el + " }}";
      result = result.replace(mark, data[el]);
    }

    return result;
  }

  /* Load the default and custom list from chrome storage */
  function loadWebsites(){
    storage.local.get(["defaultWebsites", "customWebsites", 'focusTime'], function(items){
      /* Default websites loading */
      if(items.defaultWebsites !== undefined){
        var defaults = items.defaultWebsites;
        var list = document.getElementById("defaultList");
        list.innerHTML = "";

        for(var index in defaults){
          var website = defaults[index];
          var checked = website.on ? "checked" : "";
          var element = fillTemplate(listElementTemplate, {"id": "default"+index, "el": website.url, "checked": checked});

          list.innerHTML += element;
        }
      }

      if(items.customWebsites !== undefined){
        var customWebsites = items.customWebsites;
        var table = document.getElementById("customTable");
        table.innerHTML = tableHead;

        for(var index in customWebsites){
          var website = customWebsites[index];
          var checked = website.on ? "checked" : "";
          var element = fillTemplate(tableElementTemplate, {"id": "custom"+index, "el": website.url, "checked": checked});

          table.innerHTML += element;
        }

        attachEvents();
      }
      if(items.focusTime !== undefined){
        var focusTime = items.focusTime;
        var timeInput = document.getElementById("timeInput");
        timeInput.value = focusTime;
      }
    });
  }

  function toogleDefaultElement(e){
    var id = this.parentElement.parentElement.id.replace("default", "");
    var checked = this.checked;

    storage.local.get("defaultWebsites", function(items){
      if(items.defaultWebsites !== undefined){
        items.defaultWebsites[id].on = checked;

        storage.local.set({"defaultWebsites": items.defaultWebsites});
      }
    });
  }

  function toogleCustomElement(e){
    var id = this.parentElement.parentElement.id.replace("custom", "");
    var checked = this.checked;

    storage.local.get("customWebsites", function(items){
      if(items.customWebsites !== undefined){
        items.customWebsites[id].on = checked;

        storage.local.set({"customWebsites": items.customWebsites});
      }
    });
  }

  function addCustomWebsite(e){
    if(e.keyCode === 13){
      var input = document.getElementById("addingInput");

      if(input.value.length === 0){
        return;
      }

      storage.local.get("customWebsites", function(items){
        if(items !== undefined){
          var array = items.customWebsites;

          array.push({"url": input.value, "on": true});

          storage.local.set({"customWebsites": array}, function(){
            loadWebsites();
          });

          input.value = "";
        }
      });
    }
  }

  function addFocusTime(e){
    e.preventDefault();
    var input = document.getElementById("timeInput");
    storage.local.set({"focusTime": input.value}, function(){
      loadWebsites();
      alert("Focus Mode time saved.");
    });
  }

  function deleteCustomWebsite(e){
    var id = this.parentElement.id.replace("custom", "");

    storage.local.get("customWebsites", function(items){
      if(items.customWebsites !== undefined){
        var newArray = items.customWebsites;
        newArray.splice(id, 1);

        storage.local.set({"customWebsites": newArray}, function(){
          loadWebsites();
        });
      }
    });
  }

  function attachEvents(){
    /* Deleting event */
    var crosses = document.getElementsByClassName("table-cross");

    /* Skip the first element because we don't want to affect the first line */
    for(var i = 1; i < crosses.length; i++){
      crosses.item(i).addEventListener("click", deleteCustomWebsite);
    }

    /* Checking event */
    var defaultCheckboxes = document.getElementById("defaultList").getElementsByClassName("checkbox");

    for(i = 0; i < defaultCheckboxes.length; i++){
      defaultCheckboxes.item(i).addEventListener("change", toogleDefaultElement);
    }

    var customCheckboxes = document.getElementById("customTable").getElementsByClassName("checkbox");

    for(i = 0; i < customCheckboxes.length; i++){
      customCheckboxes.item(i).addEventListener("change", toogleCustomElement);
    }
  }

  loadWebsites();
  document.getElementById("addingInput").addEventListener("keypress", addCustomWebsite);
  document.getElementById("timeInputForm").addEventListener("submit", addFocusTime);

})();
