(function(){
  'use strict';

  function renderTab(tab) {
    document.getElementById('title').textContent = tab.title;
    document.getElementById('favIcon').src = "chrome://favicon/" + tab.url;
  }

  function populateList(tabs) {
    var tabList = document.getElementById('tabList');
    document.getElementById('tabCount').textContent = Object.keys(tabs).length;

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
        favIcon.src = "chrome://favicon/" + key;
        title.innerHTML = tabs[key];

        itemDiv.addEventListener("click", (function(){
          var url = key;
          return function(){
            chrome.runtime.getBackgroundPage(function(eventPage) {
              eventPage.rlStorage.removeTab(url, function(){
                chrome.tabs.create({'url': url}, null);
              });
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
        eventPage.rlUtils.getCurrentTab(function(tab){
          eventPage.rlStorage.saveTab(tab.url, tab.title, function(){
            chrome.tabs.remove(tab.id);
          });
        })
      });
    });
  });

})();
