chrome.runtime.onStartup.addListener(function() {
  console.log('Starting browser...');
});

chrome.runtime.onInstalled.addListener(function(details) {
  console.log('Installed extension...');
});

if (chrome.webNavigation && chrome.webNavigation.onDOMContentLoaded &&
    chrome.webNavigation.onReferenceFragmentUpdated) {
  chrome.webNavigation.onDOMContentLoaded.addListener(function(){

  });
  chrome.webNavigation.onReferenceFragmentUpdated.addListener(function(){

  });
} else {
  chrome.tabs.onUpdated.addListener(function(_, details) {

  });
}

chrome.tabs.onActivated.addListener(function(activeInfo) {
  // alert("1");
    console.log('tabs activated...');
});

//listen for current tab to be changed
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    // alert("2");
    console.log('tabs updated...');
});
