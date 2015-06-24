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
        if (size > 99) chrome.browserAction.setBadgeText({text : size.toString() + "+"});
        else if (size > 0) chrome.browserAction.setBadgeText({text : size.toString()});
        else chrome.browserAction.setBadgeText({text : ""});
      })
    },

    eventsInit : function() {

    },

    saveAndCloseTab : function(tab, cusTitle, callback) {
      if (cusTitle === "") console.log("hello");
      var url = tab.url,
          title = cusTitle !== "" ? cusTitle : tab.title;
      rlStorage.saveTab(url, title, function(){
        chrome.tabs.remove(tab.id);
      });
      if (callback !== undefined) callback();
    },

    saveAndCloseCurrentTab : function(cusTitle, callback) {
      this.getCurrentTab(function(tab){
        rlUtils.saveAndCloseTab(tab, cusTitle, callback);
      })
    },

    saveAndCloseCurrentWindow : function(){
      chrome.windows.getCurrent({"populate" : true}, function(window){
        var object = {};
        if (window.hasOwnProperty("tabs")) {
          for (var tab in window.tabs) {
            var url = window.tabs[tab].url;
            var title = window.tabs[tab].title;
            object[url] = title;
          }
          rlStorage.saveWindow(object, function(){
            chrome.windows.remove(window.id);
          });
        }
      })
    },

    openALlInNewWindow : function() {

    },

    createTab : function(url) {
      chrome.tabs.create({'url': url}, function(){
        rlStorage.removeTab(url);
      });
    },

    setCommandKey : function() {
      chrome.tabs.create({'url': "chrome://extensions/configureCommands"});
    }
  }

  window.rlUtils = rlUtils;

  chrome.browserAction.setBadgeBackgroundColor({color:[190, 190, 190, 230]});

})(window);
