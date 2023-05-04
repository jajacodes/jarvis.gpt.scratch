(function(ext) {
  var queryResult = null;
  
  ext.askJarvis = function(question, callback) {
    var xhr = new XMLHttpRequest();
    var url = "https://api.openai.com/v1/engines/davinci-codex/completions";
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        queryResult = JSON.parse(xhr.responseText);
        callback();
      }
    };
    var data = JSON.stringify({
      prompt: "Q: " + question + "\nA:",
      max_tokens: 60,
      n: 1,
      stop: "\n"
    });
    xhr.send(data);
  };

  ext.getJarvisAnswer = function() {
    if (queryResult) {
      var answer = queryResult.choices[0].text.trim();
      queryResult = null;
      return answer;
    }
    return "";
  };
  
  // Cleanup function when the extension is unloaded
  ext._shutdown = function() {};
  
  // Status reporting code
  // Use this to report missing hardware, plugin or unsupported browser
  ext._getStatus = function() {
    return {status: 2, msg: 'Ready'};
  };

  // Register the extension
  var descriptor = {
    blocks: [
      ['w', 'Ask Jarvis %s', 'askJarvis', ''],
      ['r', 'Jarvis answer', 'getJarvisAnswer']
    ]
  };
  
  ScratchExtensions.register('Ask Jarvis', descriptor, ext);
})({});
