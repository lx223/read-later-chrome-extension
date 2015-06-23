(function(window){
  var rlStorage = {

    getAllTabs : function(callback){
      chrome.storage.sync.get(null, function(items){
        //TODO add in error handling
        if (callback !== null) callback(items);
      })
    },

    saveTab : function(key, value, callback){
      var tab = {};
      tab[key] = value;
      chrome.storage.sync.set(tab, function(){
        //TODO add in error handling
        if (callback !== null) callback();
        console.log(key + " " + value + " " + " SAVED Successfully");
      });
    },

    removeTab : function(key, callback) {
      chrome.storage.sync.remove(key, function(){
        //TODO add in error handling
        if (callback !== null) callback();
        console.log(key + " " + " REMOVED Successfully");
      })
    },

    clearAllTabs : function(callback) {
      chrome.storage.sync.clear(function(){
        //TODO add in error handling
        if (callback !== null) callback();
        console.log("Tabs cleared");
      });
    }
  };

  window.rlStorage = rlStorage;
  
})(window);
