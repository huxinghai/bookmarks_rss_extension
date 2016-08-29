console.log("load bookmarks rss background");

var api_domain = "http://localhost:3000/",
  currentUser = null;

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

var signUp = function(userInfo, callback){
  userInfo.provision_id = userInfo.id
  remoteRequest(api_domain + "api/v1/users", {
    user: userInfo
  }, "POST", function(res){
    console.log("sign up", res)
    currentUser = res 
    callback && callback(currentUser)
  }) 
}

var remoteCreateBookmark = function(data, callback){
  remoteRequest(api_domain + "api/v1/bookmarks", {bookmarks: data}, "POST", function(data){
    callback && callback(data)
  })
}

var get_bookmarks = function(bookmark, items){
  if(!items) items = []
  if(bookmark.url){
    items.push({
      provision_id: bookmark.id,
      parent_id: bookmark.parentId,
      index: bookmark.index,
      title: bookmark.title,
      url: bookmark.url,
      date_added: bookmark.dateAdded,
      date_group_modified: bookmark.dateGroupModified
    })
  }

  if(bookmark.children && bookmark.children.length > 0){
    bookmark.children.forEach(function(bm){
      get_bookmarks(bm, items)
    })
  }
}

chrome.identity.getProfileUserInfo(function(userInfo) {

  signUp(userInfo, function(res){

    chrome.bookmarks.getTree(function(bookmarks){
      var res_bookmarks = []
      bookmarks.forEach(function(bookmark){
        get_bookmarks(bookmark, res_bookmarks)
      })
      remoteCreateBookmark(res_bookmarks)
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


