var config = chrome.extension.getURL('config.json')

console.log("load bookmarks rss", config);

var currentUser = null
var remoteRequest = function(url, params, method, callback){
  var m = "GET";

  if(~["GET", "POST", "DELETE", "PUT"].indexOf(params)){
    m = params
    params = {}
  }

  if(typeof method == "function")
    callback = method
  else
    m = method

  var options = JSON.stringify(params);
  var xhr = new XMLHttpRequest();
  xhr.open(m, url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
  if(currentUser) xhr.setRequestHeader("Authorization", currentUser.provision_id)
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var resp = JSON.parse(xhr.responseText);
      callback && callback(resp);
    }
  }
  xhr.send(options);
}

var remoteCreateBookmark = function(bookmark, callback){
  remoteRequest("http://localhost:3000/api/v1/bookmarks", {
    provision_id: bookmark.id,
    parent_id: bookmark.parentId,
    index: bookmark.index,
    title: bookmark.title,
    date_added: bookmark.dateAdded,
    date_group_modified: bookmark.dateGroupModified
  }, "POST", function(data){
    callback && callback(data)
  })
}

var createBookmarks = function(bookmark){
  if(bookmark.url){
    remoteCreateBookmark(bookmark)  
  }
  if(bookmark.children && bookmark.children.length > 0){
    bookmark.children.forEach(function(bm){
      createBookmarks(bm)
    })
  }
}

chrome.identity.getProfileUserInfo(function(userInfo) {
  userInfo.provision_id = userInfo.id

  remoteRequest("http://localhost:3000/api/v1/users", {
    user: userInfo
  }, "POST", function(res){

    currentUser = res
    chrome.bookmarks.getTree(function(bookmarks){
      bookmarks.forEach(function(bookmark){
        createBookmarks(bookmark)
      })
    });
    
    chrome.bookmarks.onCreated.addListener(function(id, bookmark){
      console.log("onCreated lister")
      console.log(arguments)
    });

    chrome.bookmarks.onRemoved.addListener(function(id, bookmark){
      console.log("onRemoved lister")
      console.log(arguments)
    });

  })

  chrome.extension.onMessage.addListener(function() {
    console.log("simple request onMessage")
    console.log(arguments)
  });

});

var setDisplayBadge = function(number){
  if(number && number > 0){
    chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]})
  }
  chrome.browserAction.setBadgeText({text: (number || "").toString()})
}

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({ url: "http://www.168ta.com" });
  setDisplayBadge()
});

setDisplayBadge(102)


