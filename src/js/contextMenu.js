(function(window){
  'use strict';

  var contexts = ["all"];
  var menuIds = {
    "saveAndClose" : "read-later",
    "saveAndCloseAll" : "read-all-later",
    "separator1" : "separator-1",
    "separator2" : "separator-2",
    "tabsList" : "tabs-list",
    "openAll" : "open-all"
  };

  var rlContextMenu = {
    addToReadingList : function(menuId, menuTitle) {
      console.log('Function addToReadingList...');
      chrome.contextMenus.create({
        "id" : menuId,
        "title": menuTitle,
        "parentId": menuIds.tabsList
      });
    },

    removeFromReadingList : function(menuId) {
      console.log('Function removeFromReadingList...');
      chrome.contextMenus.remove(menuId, function(){
        console.log("a context menu removed...");
      });
    },

    init : function() {
      console.log('Initialising rlContextMenu...');
      chrome.contextMenus.removeAll(function(){
        console.log("all context menus removed...");
      });

      chrome.contextMenus.create({
        "id" : menuIds.saveAndClose,
        "title" : "Read tab later",
        "contexts" : contexts
      });

      chrome.contextMenus.create({
        "id" : menuIds.saveAndCloseAll,
        "title" : "Read all tabs later",
        "contexts" : contexts
      });

      chrome.contextMenus.create({
        "id" : menuIds.separator1,
        "type" : "separator",
        "contexts" : contexts
      });

      chrome.contextMenus.create({
        "id" : menuIds.tabsList,
        "title" : "Reading list",
        "contexts" : contexts
      }, function(){
        if (chrome.runtime.lastError) {
          console.log("Got expected error: " + chrome.runtime.lastError.message);
        } else {
          chrome.contextMenus.create({
            "id" : menuIds.openAll,
            "title" : "Open all tabs",
            "parentId": menuIds.tabsList
          });

          chrome.contextMenus.create({
            "id" : menuIds.separator2,
            "type" : "separator",
            "parentId": menuIds.tabsList
          });

          rlStorage.getAllTabs(function(tabs){
            for (var key in tabs) {
              if (tabs.hasOwnProperty(key)) {
                chrome.contextMenus.create({
                  "id" : key,
                  "title": tabs[key],
                  "parentId": menuIds.tabsList
                });
              }
            }
          });
          console.log("reading list context menu populated...");
        }
      });

      chrome.contextMenus.onClicked.addListener(function(info, tab){
        console.log("context menu onCliked event fired...");
        console.log(tab);
        if (info.menuItemId === menuIds.saveAndClose) {
          rlUtils.saveAndCloseTab(tab);
        } else if (info.menuItemId === menuIds.saveAndCloseAll) {
          rlUtils.saveAndCloseCurrentWindow();
        } else if (info.menuItemId === menuIds.openAll) {
          rlUtils.openALlInNewWindow();
        } else if (info.parentMenuItemId === menuIds.tabsList) {
          rlUtils.createTab(info.menuItemId);
        }
      });
    }
  };

  window.rlContextMenu = rlContextMenu;

})(window);
