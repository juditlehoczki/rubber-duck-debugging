// open permission.html at installation
chrome.tabs.create({
  url: chrome.extension.getURL("permission.html"),
  selected: true
});
