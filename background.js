chrome.browserAction.onClicked.addListener(function () {
  // The event page will unload after handling this event (assuming nothing
  // else is keeping it awake). The content script will become the main way to
  // interact with us.
  var chromeExtURL = "zmc.html";
/*
  if (!self.tabID) self.tabID = 0;
  chrome.tabs.getAllInWindow(null, function (tabs) {
    for (var j = 0; j < tabs.length; j++) {
      if (tabs[j].url == chromeExtURL) {
        chrome.tabs.update(tabs[j].id, { selected: true });

        return;
      }
    }
    if (0 == tabID) {//*/
      chrome.tabs.create({ url: chromeExtURL, selected: true }, function (tab) {
        tabID = tab.id;
      });
/*    }
	});//*/
});
chrome.tabs.onRemoved.addListener(function (tab) {
  if (tab == tabID)
    tabID = 0;
});
