(function(window){
  'use strict';

  var rlUtils = {
    getCurrentTab : function(callback){
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (callback !== null) callback(tabs[0]);
      });
    },

    updateBadge : function() {
      rlStorage.getAllTabs(function(tabs){
        var size = Object.keys(tabs).length;
        if (size > 99) chrome.browserAction.setBadgeText({text : "..."});
        else if (size > 0) chrome.browserAction.setBadgeText({text : size.toString()});
        else chrome.browserAction.setBadgeText({text : ""});
      })
    },

    eventsInit : function() {

    }
  }

  window.rlUtils = rlUtils;
})(window);
