(function(window){
  'use strict';

  var MAX_TITLE_LENGTH = 50,
      MAX_BADGE_COUNT = 99;

  var rlUtils = {
    getCurrentTab : function(callback){
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (typeof(callback) === "function"){
          callback(tabs[0]);
        }
      });
    },

    updateBadge : function() {
      rlStorage.getAllTabs(function(tabs){
        var size = Object.keys(tabs).length;
        if (size > MAX_BADGE_COUNT) chrome.browserAction.setBadgeText({text : size.toString() + "+"});
        else if (size > 0) chrome.browserAction.setBadgeText({text : size.toString()});
        else chrome.browserAction.setBadgeText({text : ""});
      });
    },

    saveAndCloseTab : function(tab, cusTitle, callback) {
      var url = tab.url,
          title = tab.title;
      if (typeof(cusTitle) === "string" && cusTitle !== "") title = cusTitle;
      if (title.length > MAX_TITLE_LENGTH) title = title.substr(0, MAX_TITLE_LENGTH) + "...";
      rlStorage.saveTab(url, title, function(){
        chrome.tabs.remove(tab.id);
      });
      if (typeof(callback) === "function"){
        callback();
      }
    },

    saveAndCloseCurrentTab : function(cusTitle, callback) {
      this.getCurrentTab(function(tab){
        rlUtils.saveAndCloseTab(tab, cusTitle, callback);
      });
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
      });
    },

    openALlInNewWindow : function() {
      rlStorage.getAllTabs(function(tabs){
        var createData = {};
        var urls = [];
        for (var key in tabs) {
          if (tabs.hasOwnProperty(key)) {
            urls.push(key);
          }
        }
        createData["url"] = urls;
        createData["focused"] = true;
        console.log(createData);
        chrome.windows.create(createData, function(){
          console.log('Opened all items...');
          console.log(createData);
          rlStorage.clearAllTabs();
        });
      });
    },

    createTab : function(url) {
      chrome.tabs.create({'url': url}, function(){
        rlStorage.removeTab(url);
      });
    },

    setCommandKey : function() {
      chrome.tabs.create({'url': "chrome://extensions/configureCommands"});
    },

    init : function() {
      console.log('Initialising rlUtils...');
      chrome.browserAction.setBadgeBackgroundColor({color:[190, 190, 190, 230]});
      this.updateBadge();
    }
  };

  window.rlUtils = rlUtils;

})(window);