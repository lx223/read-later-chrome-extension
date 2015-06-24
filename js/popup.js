(function(){
  'use strict';

  function updateStatus(message) {

  }

  function getFaviconUrl(url) {
    return "chrome://favicon/" + url;
  }

  function renderTab(tab) {
    document.getElementById('title').textContent = tab.title;
    document.getElementById('favIcon').src = "chrome://favicon/" + tab.url;
  }

  function populateList(tabs) {
    var tabList = document.getElementById('tabList');
    document.getElementById('tabCount').textContent = "Total number of reading items: " + Object.keys(tabs).length;

    while (tabList.firstChild) {
      tabList.removeChild(tabList.firstChild);
    }

    for (var key in tabs) {
      if (tabs.hasOwnProperty(key)) {
        console.log(key + " -> " + tabs[key]);

        var itemDiv = document.createElement('div');
        var favIcon = document.createElement('img');
        var title = document.createElement('span');

        itemDiv.className = "cat-2";

        favIcon.className = "favIcon";
        favIcon.src = getFaviconUrl(key);
        title.innerHTML = tabs[key];

        itemDiv.addEventListener("click", (function(url){
          return function(){
            chrome.runtime.getBackgroundPage(function(eventPage) {
              eventPage.rlUtils.createTab(url);
            });
          }
        })(key));

        // Append search results to the HTML nodes
        itemDiv.appendChild(favIcon);
        itemDiv.appendChild(title);
        tabList.appendChild(itemDiv);
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
