(function(window){

  function initExtn() {
    console.log('Initialising extension...');
    rlStorage.init();
    rlUtils.init();
    rlContextMenu.init();

    // wire up command
    chrome.commands.onCommand.addListener(function(command) {
      rlUtils.saveAndCloseCurrentTab();
    });
  }
  initExtn();

  chrome.runtime.onStartup.addListener(function() {
    console.log('Starting browser...');
  });

  chrome.runtime.onInstalled.addListener(function(details) {
    console.log('Installed extension...');
  });

  chrome.tabs.onActivated.addListener(function(activeInfo) {

  });

  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

  });
})();
