(function(){
  
  function test() {
    chrome.storage.sync.set({'value': 'hello world',
    'value2':'hello world2'}, function() {
            // Notify that we saved.
            console.log('Settings saved');
          });
  }

  function test3() {
    chrome.storage.sync.set({'value3': 'hello world3',
    'value4':'hello world4'}, function() {
            // Notify that we saved.
            console.log('Settings saved');
          });
  }

  function test2() {
    chrome.storage.sync.get(null, function(items) {
      for (var key in items) {
        if (items.hasOwnProperty(key)) {
          console.log(key + " -> " + items[key]);
        }
      }
    })
  }
})();
