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

/* Singleton to handle chrome storage operations (currently only local) */

const localstorage = chrome.storage.local;

class Storage {
  get(items){
    return new Promise((resolve, reject) => {
      if(items){
        localstorage.get(items, (items) => {
          resolve(items);
        });
      } else {
        reject("no items asked");
      }
    });
  }

  set(values){
    return new Promise((resolve, reject) => {
      if(values){
        localstorage.set(values);
      } else {
        reject("no values provided");
      }
    });
  }
}

let storage = new Storage();

export default storage;
