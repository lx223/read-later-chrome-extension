(function(window){
  'use strict';
  
  var rlUtils = {
    getCurrentTab : function(callback){
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (callback !== null) callback(tabs[0]);
      });
    }
  }

  window.rlUtils = rlUtils;
})(window);
