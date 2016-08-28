
console.log("init popup.js");


chrome.extension.onConnect.addListener(function(port) {
  console.log("on connect.........")
  console.assert(port.name == "knockknock");
  port.onMessage.addListener(function(msg) {
    if (msg.joke == "Knock knock")
      port.postMessage({question: "Who's there?"});
    else if (msg.answer == "Madame")
      port.postMessage({question: "Madame who?"});
    else if (msg.answer == "Madame... Bovary")
      port.postMessage({question: "I don't get it."});
  });
});

// chrome.extension.onRequest.addListener(
//   function(request, sender, sendResponse) {
//     console.log("on request....");
//     document.getElementById('theButton').value = "xxxxxxx"

//     if (request.greeting == "hello"){
//       sendResponse({farewell: "goodbye"});
//     }else{
//       sendResponse({}); // snub them.
//     }
//   });