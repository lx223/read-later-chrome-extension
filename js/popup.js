(function(){
  'use strict';

  function getCurrentTab(callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      callback(tabs[0]);
    });
  }

  function renderTab(tab) {
    document.getElementById('title').textContent = tab.title;
    document.getElementById('url').textContent = tab.url;
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

        favIcon.className = "favIcon"
        favIcon.src = "chrome://favicon/" + key;
        title.innerHTML = tabs[key];

        itemDiv.addEventListener("click", (function(){
          var url = key;
          return function(){
            chrome.runtime.getBackgroundPage(function(eventPage) {
              eventPage.storage.removeTab(url, function(){
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
      eventPage.storage.getAllTabs(populateList);
    });


    document.getElementById("clearListButton").addEventListener('click', function() {
      chrome.runtime.getBackgroundPage(function(eventPage) {
        eventPage.storage.clearAllTabs(populateList([]));
      });
    });

    document.getElementById("readLaterButton").addEventListener('click', function() {
        getCurrentTab(function(tab) {
          renderTab(tab);
          chrome.runtime.getBackgroundPage(function(eventPage) {
            eventPage.storage.saveTab(tab.url, tab.title, function(){
              chrome.tabs.remove(tab.id);
            });
          });
        });
      });
  });

})();
