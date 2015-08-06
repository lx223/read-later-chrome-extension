(function(){
  'use strict';

  var trashIconURI = "img/trash128_active.png";

  function updateStatus(message) {
    console.log("Update status: " + message);
    if (message) document.getElementById('message').textContent = message;
  }

  function renderTab(tab) {
    console.log("Render tab info: " + tab);
    document.getElementById("cusTitle").placeholder = tab.title;
  }

  // Create the HTML object for an item
  function getListItem(url, title) {
    console.log("Get list item: " + url + " title: " + title);
    var itemContainer = document.createElement('div');
    var item = document.createElement('a'); // Create HTML DOM for the clickable item
    var trash = document.createElement('img'); // Create HTML DOM to trash an item

    // Set itemContainer's properties
    itemContainer.className = "list-group-item";

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
    trash.className = "glyphicon glyphicon-trash";
    trash.src = trashIconURI;

    itemContainer.appendChild(item);
    itemContainer.appendChild(trash);
    return itemContainer;
  }

  function populateList(items) {
    console.log("Populate list...");
    document.getElementById('tabCount').textContent = "Total number of reading items: " + Object.keys(items).length;
    var listContainer = document.getElementById('list-container');

    // Remove the current list
    while (tabList.firstChild) {
      tabList.removeChild(tabList.firstChild);
    }

    var groups = {};
    for (var key in items) {
      if (items.hasOwnProperty(key)) {
        var tab = {"url" : key,
                   "title" : items[key].title,
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
          var item = getListItem(tabs[index].url, tabs[index].title);
          groupList.appendChild(item);
        }

        listContainer.appendChild(groupList);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    updateStatus("Customise the tile below or leave it as default");

    chrome.runtime.getBackgroundPage(function(eventPage) {
      eventPage.rlUtils.getCurrentTab(renderTab);
    });

    chrome.runtime.getBackgroundPage(function(eventPage) {
      eventPage.rlStorage.getAllTabs(populateList);
    });

    document.getElementById("clearListButton").addEventListener('click', function() {
      var confirmed = confirm("Are you sure you want to delete all links?");
      if(confirmed === true){
        chrome.runtime.getBackgroundPage(function(eventPage) {
          eventPage.rlStorage.clearAllTabs(populateList([]));
        });
      }
    });

    document.getElementById("readLaterButton").addEventListener('click', function() {
      chrome.runtime.getBackgroundPage(function(eventPage){
        eventPage.rlUtils.saveAndCloseCurrentTab(document.getElementById("cusTitle").value,
                                                 document.getElementById("group").value
                                                );
      });
    });
  });

})();
