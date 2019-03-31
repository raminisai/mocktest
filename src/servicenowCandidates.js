var requestBody = "";
export var validate;
var client = new XMLHttpRequest();

var username = $("#usr");
var usr;
username.on("input", function() {
  console.log($(this).val());
  usr = $(this).val();
});
$("#login").on("click", function(e) {
  let { result } = JSON.parse(retriveAllRecords());
  for (let i = 0; i < result.length; i++) {
    console.log(result[i]["u_string_1"]);
    if (usr === result[i]["u_string_1"]) {
      console.log("matched");
      window.location.href = "./public/dashboard.html";
      return false;
    }
  }
  alert("invalid credentials");
});

export function retriveAllRecords() {
  client.open(
    "get",
    "https://cors-anywhere.herokuapp.com/https://dev61094.service-now.com/api/now/table/x_259033_mock_test_candidate",
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
  return client.responseText;
}
export function updateRecord(id) {
  requestBody = '{"u_integer_3":"1","u_integer_2":"1","u_integer_4":"1"}';

  var client = new XMLHttpRequest();
  client.open(
    "put",
    "https://dev61094.service-now.com/api/now/table/x_259033_mock_test_candidate/a08ed5dedb7363003b299b81ca9619bb"
  );

  client.setRequestHeader("Accept", "application/json");
  client.setRequestHeader("Content-Type", "application/json");

  //Eg. UserName="admin", Password="admin" for this code sample.
  client.setRequestHeader(
    "Authorization",
    "Basic " + btoa("admin" + ":" + "admin")
  );

  client.onreadystatechange = function() {
    if (this.readyState == this.DONE) {
      document.getElementById("response").innerHTML =
        this.status + this.response;
    }
  };
  client.send(requestBody);
}
