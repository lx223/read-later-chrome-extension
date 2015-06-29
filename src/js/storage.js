(function(window){
  'use strict';

  var rlStorage = {

    getAllTabs : function(callback){
      chrome.storage.sync.get(null, function(items){
        if (typeof(callback) === "function") callback(items);
      })
    },

    saveTab : function(key, value, callback){
      var tab = {};
      tab[key] = value;
      chrome.storage.sync.set(tab, function(){
        //TODO add in error handling
        if (typeof(callback) === "function") callback();
        console.log(key + " " + value + " " + " SAVED Successfully");
      });
    },

    saveWindow : function(windowObject, callback){
      chrome.storage.sync.set(windowObject, function(){
        //TODO add in error handling
        if (typeof(callback) === "function") callback();
        console.log(windowObject + " SAVED Successfully");
      });
    },

    removeTab : function(key, callback) {
      chrome.storage.sync.remove(key, function(){
        if (typeof(callback) === "function") callback();
        console.log(key + " " + " REMOVED Successfully");
      })
    },

    clearAllTabs : function(callback) {
      chrome.storage.sync.clear(function(){
        if (typeof(callback) === "function") callback();
        console.log("Tabs cleared");
      });
    },

    init : function() {
      console.log('Initialising rlStorage...');

      chrome.storage.onChanged.addListener(function(changes, namespace) {
        rlUtils.updateBadge();
        for (var key in changes) {
          var storageChange = changes[key];
          if (storageChange.oldValue === undefined) rlContextMenu.addToReadingList(key, storageChange.newValue);
          if (storageChange.newValue === undefined) rlContextMenu.removeFromReadingList(key);

          console.log('Storage key "%s" in namespace "%s" changed. ' +
                      'Old value was "%s", new value is "%s".',
                      key,
                      namespace,
                      storageChange.oldValue,
                      storageChange.newValue);
        }
      });
    }
  };

  window.rlStorage = rlStorage;
})(window);
