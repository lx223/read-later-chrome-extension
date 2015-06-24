(function(window){
  'use strict';

  var rlUtils = {
    getCurrentTab : function(callback){
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (callback !== undefined) callback(tabs[0]);
      });
    },

    updateBadge : function() {
      rlStorage.getAllTabs(function(tabs){
        var size = Object.keys(tabs).length;
        if (size > 10000) chrome.browserAction.setBadgeText({text : "..."});
        else if (size > 0) chrome.browserAction.setBadgeText({text : size.toString()});
        else chrome.browserAction.setBadgeText({text : ""});
      })
    },

    eventsInit : function() {

    },

    saveAndCloseTab : function(tab, callback) {
      this.getCurrentTab(function(tab){
        rlStorage.saveTab(tab.url, tab.title, function(){
          chrome.tabs.remove(tab.id);
        });
      })
      if (callback !== undefined) callback();
    },

    saveAndCloseCurrentTab : function(callback) {
      this.getCurrentTab(function(tab){
        rlStorage.saveTab(tab.url, tab.title, function(){
          chrome.tabs.remove(tab.id);
        });
      })
      if (callback !== undefined) callback();
    },

    createTab : function(url) {
      chrome.tabs.create({'url': url}, function(){
        rlStorage.removeTab(url);
      });
    }
  }

  window.rlUtils = rlUtils;

  chrome.browserAction.setBadgeBackgroundColor({color:[190, 190, 190, 230]});

})(window);
