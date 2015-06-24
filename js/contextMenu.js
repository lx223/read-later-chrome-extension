(function(window){
  'use strict';

  var contexts = ["all"];
  var menuIds = {
    "saveAndClose" : "read-later",
    "saveAndCloseAll" : "read-all-later",
    "separator" : "separator",
    "tabsList" : "tabs-list"
  }

  chrome.contextMenus.removeAll(function(){
    console.log("all context menus removed...");
  });

  chrome.contextMenus.create({
    "id" : menuIds.saveAndClose,
    "title" : "Read tab later",
    "contexts" : contexts
  })

  chrome.contextMenus.create({
    "id" : menuIds.saveAndCloseAll,
    "title" : "Read all tabs later",
    "contexts" : contexts
  })

  chrome.contextMenus.create({
    "id" : menuIds.separator,
    "type" : "separator",
    "contexts" : contexts
  })

  chrome.contextMenus.create({
    "id" : menuIds.tabsList,
    "title" : "Reading list",
    "contexts" : contexts
  }, function(){
    if (chrome.runtime.lastError) {
      console.log("Got expected error: " + chrome.runtime.lastError.message);
    } else {
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
  })

  var rlContextMenu = {
    addToReadingList : function(menuId, menuTitle) {
      chrome.contextMenus.create({
        "id" : menuId,
        "title": menuTitle,
        "parentId": menuIds.tabsList
      });
    },

    removeFromReadingList : function(menuId) {
      chrome.contextMenus.remove(menuId, function(){
        console.log("a context menu removed...");
      });
    }
  };

  chrome.contextMenus.onClicked.addListener(function(info, tab){
    console.log("context menu onCliked event fired...");
    if (info.menuItemId === menuIds.saveAndClose) {
      rlUtils.saveAndCloseTab(tab);
    }

    if (info.menuItemId === menuIds.saveAndCloseAll) {
      rlUtils.saveAndCloseCurrentWindow();
    }

    if (info.parentMenuItemId === menuIds.tabsList) {
      rlUtils.createTab(info.menuItemId);
    }
  })

  window.rlContextMenu = rlContextMenu;

})(window);
