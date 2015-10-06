(function(){
  'use strict';

  var trashIconURI = "img/trash128_active.png";

  function getTabInfo(tab) {
    if (typeof(tab) === "undefined") return;
    document.getElementById("cusTitle").placeholder = tab.title;

    var favicon = document.createElement('canvas');
    favicon.height = 16;
    favicon.width = 16;
    var favContext = favicon.getContext('2d');
    var faviconUrl = "chrome://favicon/" + tab.url;
    var img = new Image();
    img.onload = function(){
      favContext.drawImage(img, 0, 0); // Or at whatever offset you like
      document.getElementById("faviconDataUrl").innerHTML = favicon.toDataURL();
    };
    img.src = faviconUrl;
  }

  // Create the HTML object for an item
  function getListItem(tab) {
    var url = tab.url,
        title = tab.title,
        faviconDataUrl = tab.faviconDataUrl;

    console.log("Get list item: " + tab.faviconDataUrl);
    var itemContainer = document.createElement('div');
    var favicon = document.createElement('canvas');
    var item = document.createElement('a'); // Create HTML DOM for the clickable item
    var trash = document.createElement('img'); // Create HTML DOM to trash an item

    // Set itemContainer's properties
    itemContainer.className = "list-item";

    // Set favicon's properties
    favicon.height = 16;
    favicon.width = 16;
    var favContext = favicon.getContext('2d');
    var img = new Image();
    img.onload = function(){
      favContext.drawImage(img, 0, 0); // Or at whatever offset you like
      // alert(favicon.toDataURL());
    };
    if (typeof(faviconDataUrl) === "undefined") {
      faviconDataUrl = "chrome://favicon/" + url;
    }
    img.src = faviconDataUrl;

    // Set item's properties
    item.href = url;
    item.innerHTML = title;
    item.addEventListener("click", (function(url){
      return function(){
        chrome.runtime.getBackgroundPage(function(eventPage) {
          eventPage.rlUtils.createTab(url);
        });
      };
    })(url));

    // Set trash's properties
    trash.src = trashIconURI;
    trash.addEventListener("click", (function(url){
      return function(){
        chrome.runtime.getBackgroundPage(function(eventPage) {
          eventPage.rlStorage.removeTab(url);
        });
        trash.parentNode.parentNode.removeChild(itemContainer);
        document.getElementById('tabCount').textContent = document.getElementById('tabCount').textContent - 1;
      };
    })(url));
    trash.tabIndex = "0";

    itemContainer.appendChild(favicon);
    itemContainer.appendChild(item);
    itemContainer.appendChild(trash);

    return itemContainer;
  }

  function populateList(items) {
    document.getElementById('tabCount').textContent = Object.keys(items).length;
    var listContainer = document.getElementById('list-container');

    // Remove the current list first
    while (tabList.firstChild) {
      tabList.removeChild(tabList.firstChild);
    }

    var groups = {};
    for (var key in items) {
      if (items.hasOwnProperty(key)) {
        var tab = {"url" : key,
                   "title" : items[key].title,
                   "faviconDataUrl" : items[key].faviconDataUrl,
                   "timestamp" : items[key].timestamp
                 },
            group = (typeof(items[key].group) === "undefined") ? "Default" : items[key].group;
        if (groups[group]) {
          groups[group].push(tab);
        } else {
          groups[group] = [tab];
        }
      }
    }

    for (key in groups) {
      if (groups[key]) {
        groups[key].sort(function(a, b){
          if(a.timestamp > b.timestamp) return -1;
          if(a.timestamp < b.timestamp) return 1;
          return 0;
        });

        var groupList = document.createElement('div');
        groupList.className = "list-group";
        var tabs = groups[key];
        for (var index = 0; index < tabs.length; ++index) {
          var item = getListItem(tabs[index]);
          groupList.appendChild(item);
        }

        listContainer.appendChild(groupList);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', function() {

    // Fill the title textarea
    chrome.runtime.getBackgroundPage(function(eventPage) {
      eventPage.rlUtils.getCurrentTab(getTabInfo);
    });

    // Retrieve the list of all saved items
    chrome.runtime.getBackgroundPage(function(eventPage) {
      eventPage.rlStorage.getAllTabs(populateList);
    });

    // Wire an event to save a tab to the list
    document.getElementById("readLaterButton").addEventListener('click', function() {
      chrome.runtime.getBackgroundPage(function(eventPage){
        eventPage.rlUtils.saveAndCloseCurrentTab(document.getElementById("cusTitle").value, "", "", document.getElementById("faviconDataUrl").innerHTML);
      });
    });
  });

})();
