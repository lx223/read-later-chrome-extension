(function(){
  'use strict';

  function updateStatus(message) {
    console.log("Update status: " + message);
  }

  function getFaviconUrl(url) {
    console.log("Get favicon url: " + url);
    return "chrome://favicon/" + url;
  }

  function renderTab(tab) {
    console.log("Render tab: " + tab);
    document.getElementById('title').textContent = tab.title;
    document.getElementById('favIcon').src = "chrome://favicon/" + tab.url;
  }

  function getListItem(url, title) {
    console.log("Get list item: " + url + " title: " + title);
    var item = document.createElement('a');
    var favIcon = document.createElement('img');
    var titleSpan = document.createElement('span');
    var trashIconSpan = document.createElement('span');

    item.className = "list-group-item";
    item.href = url;

    favIcon.className = "favIcon";
    favIcon.src = getFaviconUrl(url);
    titleSpan.innerHTML = title;
    titleSpan.title = title;
    trashIconSpan.className = "glyphicon glyphicon-trash";

    item.addEventListener("click", (function(url){
      return function(){
        chrome.runtime.getBackgroundPage(function(eventPage) {
          eventPage.rlUtils.createTab(url);
        });
      };
    })(url));

    // Append search results to the HTML nodes
    item.appendChild(favIcon);
    item.appendChild(titleSpan);
    item.appendChild(trashIconSpan);
    return item;
  }

  function populateList(tabs) {
    console.log("Populate list: " + tabs);
    var tabList = document.getElementById('tabList');
    document.getElementById('tabCount').textContent = "Total number of reading items: " + Object.keys(tabs).length;

    while (tabList.firstChild) {
      tabList.removeChild(tabList.firstChild);
    }

    for (var key in tabs) {
      if (tabs.hasOwnProperty(key)) {
        console.log(key + " -> " + tabs[key]);

        var item = getListItem(key, tabs[key]);
        tabList.appendChild(item);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', function() {

    chrome.runtime.getBackgroundPage(function(eventPage) {
      eventPage.rlUtils.getCurrentTab(renderTab);
    });

    chrome.runtime.getBackgroundPage(function(eventPage) {
      eventPage.rlStorage.getAllTabs(populateList);
    });

    document.getElementById("clearListButton").addEventListener('click', function() {
      chrome.runtime.getBackgroundPage(function(eventPage) {
        eventPage.rlStorage.clearAllTabs(populateList([]));
      });
    });

    document.getElementById("readLaterButton").addEventListener('click', function() {
      chrome.runtime.getBackgroundPage(function(eventPage){
        eventPage.rlUtils.saveAndCloseCurrentTab(document.getElementById("cusTitle").value);
      });
    });
  });

})();
