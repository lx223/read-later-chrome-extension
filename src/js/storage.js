(function(window){
  'use strict';

  var rlStorage = {

    getAllTabs : function(callback){
      console.log("Get all tabs...");
      chrome.storage.sync.get(null, function(items){
        if (typeof(callback) === "function") callback(items);
      });
    },

    saveTab : function(key, value, callback){
      console.log("Save tab...");
      var tab = {};
      tab[key] = value;
      console.log(tab);
      chrome.storage.sync.set(tab, function(){
        console.log(key + " " + JSON.stringify(value) + " " + " SAVED Successfully");
        if (typeof(callback) === "function") callback();
      });
    },

    saveWindow : function(windowObject, callback){
      console.log("Save window...");
      chrome.storage.sync.set(windowObject, function(){
        //TODO add in error handling
        if (typeof(callback) === "function") callback();
        console.log(windowObject + " SAVED Successfully");
      });
    },

    removeTab : function(key, callback) {
      console.log("Remove tab...");
      chrome.storage.sync.remove(key, function(){
        if (typeof(callback) === "function") callback();
        console.log(key + " " + " REMOVED Successfully");
      });
    },

    clearAllTabs : function(callback) {
      console.log("Clear all tabs...");
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
          if (storageChange.oldValue === undefined) rlContextMenu.addToReadingList(key, storageChange.newValue.title);
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
