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

  // A quick fix to wire events to listener whenever the eventpages are loaded
  initExtn();

  chrome.runtime.onStartup.addListener(function() {
    console.log('Starting browser...');
    // initExtn();
  });

  chrome.runtime.onInstalled.addListener(function(details) {
    console.log('Installed extension...');
    // initExtn();
  });

  chrome.tabs.onActivated.addListener(function(activeInfo) {

  });

  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

  });
})();
