chrome.runtime.onStartup.addListener(function() {
  console.log('Starting browser...');
  rlUtils.updateBadge();
});

chrome.runtime.onInstalled.addListener(function(details) {
  console.log('Installed extension...');
  rlUtils.updateBadge();
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
  console.log('tabs activated...');
  rlUtils.updateBadge();
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  console.log('tabs updated...');
  rlUtils.updateBadge();
});

chrome.browserAction.setBadgeBackgroundColor({color:[190, 190, 190, 230]});
