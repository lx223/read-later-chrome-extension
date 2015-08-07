(function(window){
  'use strict';

  var contexts = ["all"];
  var menuIds = {
    "readTabLater" : "read-later",
    "readAllLater" : "read-all-later",
    "readLinkLater" : "read-link-later",
    "openAll" : "open-all"
  };

  var rlContextMenu = {
    init : function() {
      console.log('Initialising rlContextMenu...');
      chrome.contextMenus.removeAll(function(){
        console.log("all context menus removed...");
      });

      chrome.contextMenus.create({
        "id" : menuIds.readTabLater,
        "title" : "Read this tab later",
        "contexts" : contexts
      });

      chrome.contextMenus.create({
        "id" : menuIds.readLinkLater,
        "title" : "Read this link later",
        "contexts" : ["link"]
      });

      chrome.contextMenus.create({
        "id" : menuIds.readAllLater,
        "title" : "Read all tabs later",
        "contexts" : contexts
      });

      // chrome.contextMenus.create({
      //   "id" : menuIds.openAll,
      //   "title" : "Open all tabs",
      //   "contexts" : contexts
      // });

      chrome.contextMenus.onClicked.addListener(function(info, tab){
        console.log("context menu onCliked event fired...");
        console.log(tab);
        if (info.menuItemId === menuIds.readTabLater) {
          rlUtils.saveAndCloseTab(tab);
        } else if (info.menuItemId === menuIds.readAllLater) {
          rlUtils.saveAndCloseCurrentWindow();
        } else if (info.menuItemId === menuIds.openAll) {
          rlUtils.openALlInNewWindow();
        } else if (info.menuItemId === menuIds.readLinkLater) {
          rlUtils.saveLink(info.selectionText, info.linkUrl);
        }
      });
    }
  };

  window.rlContextMenu = rlContextMenu;
})(window);
