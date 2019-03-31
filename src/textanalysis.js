//data imported from servicenow questionaies tables
import { data } from "./serviceNowQuestions.js";
import { main } from "./prediction";
// sentiment is a node library used for sentiment analysis
let Sentiment = require("sentiment");
//language detect able to detect 52 languages, it is a node library
const LanguageDetect = require("languagedetect");
const lngDetector = new LanguageDetect();
//keyword-extractor useful for stopword removal
let keyword_extractor = require("keyword-extractor");

let precise = function(data) {
  let precise_data;
  for (let i = 0; i < data.length; i++) {
    precise_data += " " + data[i];
  }
  return precise_data;
};
let sent, tech, lng;
function extract(data) {
  let questions = JSON.parse(data);
  let { result } = questions;
  let ans = [];
  for (let i = 0; i < result.length; i++) {
    ans.push(result[i].u_string_2);
  }
  return ans;
}
function technical(user, server) {
  let score = 0;
  let options = {
    language: "english",
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: false
  };
  for (let i = 0; i < user.length; i++) {
    score +=
      _.intersection(
        keyword_extractor.extract(user[i], options),
        keyword_extractor.extract(server[i], options)
      ).length / keyword_extractor.extract(server[i], options).length;
  }
  return score;
}
export let TextAnalytics = function(input) {
  let composed_data = precise(input);
  lng = lngDetector.detect(composed_data, 1)[0][1];
  console.log(lngDetector.detect(composed_data, 1));
  var sentiment = new Sentiment();
  console.log(sentiment.analyze(composed_data));
  sent = sentiment.analyze(composed_data).comparative;
  tech = technical(input, extract(data));
  if (sent < 0) sent = -1;
  else if (sent > 0) sent = 1;
  var requestBody = `{"u_float_4":${lng},"u_float_3":${sent},"u_float_5":${tech}}`;

  var client = new XMLHttpRequest();
  client.open(
    "put",
    "https://cors-anywhere.herokuapp.com/https://dev61094.service-now.com/api/now/table/x_259033_mock_test_candidate/7bc152eedb7323003b299b81ca9619ed"
  );

  client.setRequestHeader("Accept", "application/json");
  client.setRequestHeader("Content-Type", "application/json");

  //Eg. UserName="admin", Password="admin" for this code sample.
  client.setRequestHeader(
    "Authorization",
    "Basic " + btoa("admin" + ":" + "Amulya@12")
  );

  client.onreadystatechange = function() {
    if (this.readyState == this.DONE) {
      document.getElementById("response").innerHTML =
        this.status + this.response;
    }
  };
  client.send(requestBody);
  let predictedData = [
    {
      vocabulary: lng,
      technical: tech,
      sentiment: sent
    }
  ];

  main(predictedData);
  return [sent, tech, lng];
};
