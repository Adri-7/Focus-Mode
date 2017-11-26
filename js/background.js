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

  /* Load the websites to block and pass it to the callback */
  function loadWebsites(callback){
    var websites = [];

    storage.local.get("lists", function(items){
      //TODO handle old lists to keep backward compatibility ?

      if(!items.lists){
        //TODO prepare an init method to prefill lists property
        storage.local.set({'lists': [{name:"Social", urls:["facebook.com", "youtube.com", "twitter.com"], on: true}, {name: "test", urls:["blabla.fr", "test.org"], on: true}]});

        return;
      }

      for(var index in items.lists){
        var list = items.lists[index];

        if(list.on){
          websites.concat(list.urls);
        }
      }

      console.log(items.lists);
      console.log(websites);

      //Call the callback and pass the resulting array
      if(typeof callback === "function"){
        callback(websites);
      }
    });
  }

  /* Check if the url contains words from the keywords array */
  function urlContains(url, keywords){
    var result = false;

    for(var index in keywords){
      if(keywords[index].on && url.indexOf(keywords[index].url) != -1){
        result = true;
        break;
      }
    }

    return result;
  }

  /* Redirect if necessary */
  function analyzeUrl(details){
    storage.local.get("on", function(item){
      if(item.on === true){

        loadWebsites(function(websites){
          /* FrameId test to be sure that the navigation event doesn't come from a subframe */
          if(details.frameId === 0 && urlContains(details.url, websites)){
            var id = details.tabId;

            //Redirect to the "return to work message"
            //TODO find a way to keep old URL in the tab ?
            chrome.tabs.update(id, {"url": "html/message.html"});

            /* update the number of blocked attempts */
            storage.local.get("blocked", function(item){
              storage.local.set({"blocked": item.blocked+1});
              console.log(item);
            });
          }
        });
      }
    });
  }

  /* Attach event callback */
  chrome.webNavigation.onCommitted.addListener(analyzeUrl);

  storage.local.get("on", function(item){
    if(item.on === undefined){
      /* deactivated by default & set the number of blocked attempts*/
      storage.local.set({"on": false, "blocked": 0});
    }
  });

  /* Load on start */
  loadWebsites();
})();
