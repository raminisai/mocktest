"use strict";
// import https from "https";
const https = require("https");
// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the accessKey string value with your valid access key.
let accessKey = "4a98f14f888d4a28bfbd1a04da102374";

// Replace or verify the region.

// You must use the same region in your REST API call as you used to obtain your access keys.
// For example, if you obtained your access keys from the westus region, replace
// "westcentralus" in the URI below with "westus".

// NOTE: Free trial access keys are generated in the westcentralus region, so if you are using
// a free trial access key, you should not need to change this region.
let uri = "centralindia.api.cognitive.microsoft.com";
let path = "/text/analytics/v2.0/languages";

let response_handler = function(response) {
  let body = "";
  response.on("data", function(d) {
    body += d;
  });
  response.on("end", function() {
    let body_ = JSON.parse(body);
    let body__ = JSON.stringify(body_, null, "  ");
    console.log(body__);
    let score = 0.0;
    for (let i = 0; i < body_["documents"].length; i++) {
      score += body_["documents"][i]["detectedLanguages"][0]["score"];
    }
    return score / body_["documents"].length;
  });
  response.on("error", function(e) {
    console.log("Error: " + e.message);
  });
};

export let get_language = function(documents) {
  let body = JSON.stringify(documents);

  let request_params = {
    method: "POST",
    hostname: uri,
    path: path,
    headers: {
      "Ocp-Apim-Subscription-Key": accessKey
    }
  };

  let req = https.request(request_params, response_handler);
  req.write(body);
  req.end();
};

let documents = {
  documents: [
    { id: "1", text: "This a nenu chesindi writing in Eng." },
    { id: "2", text: "Este es un document escrito en Español." },
    { id: "3", text: "这是一个用中文写的文件" }
  ]
};

get_language(documents);
