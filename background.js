chrome.identity.getProfileUserInfo(function(userInfo) {
  console.log(userInfo)

  chrome.bookmarks.getTree(function(){
    console.log("getTree=======")
    console.log(arguments)
  });

  chrome.bookmarks.onCreated.addListener(function(id, bookmark){
    console.log("onCreated======")
    console.log(arguments)
  });

  chrome.bookmarks.onRemoved.addListener(function(){
    console.log("onRemoved======")
    console.log(arguments)
  });

  chrome.extension.onMessage.addListener(function() {
    console.log("...simple.request..onMessage")
    console.log(arguments)
  });

});

var setDisplayBadge = function(number){
  if(number && number > 0){
    chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]})
  }else{
    number = ""
  }
  chrome.browserAction.setBadgeText({text: number.toString()})
}

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({ url: "http://www.168ta.com" });
  setDisplayBadge()
});

setDisplayBadge(102)


