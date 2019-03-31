var requestBody = "";
export var data;
var client = new XMLHttpRequest();
client.open(
  "get",
  "https://cors-anywhere.herokuapp.com/https://dev61094.service-now.com/api/now/table/x_259033_mock_test_questions",
  false
);

client.setRequestHeader("Accept", "application/json");
client.setRequestHeader("Content-Type", "application/json");

//Eg. UserName="admin", Password="admin" for this code sample.
client.setRequestHeader(
  "Authorization",
  "Basic " + btoa("admin" + ":" + "Amulya@12")
);

client.send(requestBody);
data = client.responseText;
