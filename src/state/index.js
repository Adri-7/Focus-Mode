/*******************************************************************************
Copyright (C) 2017 Adrien Coppola

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

/* Singleton to store extension's state */

import storage from './storage.js';

class State {
  constructor(){
    this.on = false;
    this.websites = [];
    this.stats = {
      attempts: 0,
      startedTime: null
    }
  }

  loadFromStorage(){
    storage.get(["on", "websites", "stats"])
      .then((items) => {
        if(items.on)
          this.on = items.on;

        if(items.website)
          this.websites = items.websites;

        if(items.stats)
          this.stats = items.stats;
      })
      .catch((err) => {
        console.log(err);
      })
  }

  saveToStorage(){
    storage.set({
      "on": this.on,
      "websites": this.websites,
      "stats": this.stats
    });
  }
}

let state = new State();
state.loadFromStorage();

export default state;
