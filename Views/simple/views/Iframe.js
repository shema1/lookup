var IframeView = function ($scope) {
  // $scope.purchaseNumber = localStorage.getItem('pwp-purchase-number');
  // $scope.purchaseAmount = localStorage.getItem('pwp-purchase-amount');

  // const session = JSON.parse(window.localStorage.getItem('SPA_auth_session'));
  // $scope.userId = session.userId;
  var pwpAppFrame = document.getElementById("appFrame");

  console.log("pwpAppFrame", pwpAppFrame)
  // // TODO: replace base URL in production!
  // var baseUrl = "https://pwp-test.herokuapp.com/";

  // var frameUlr = baseUrl + "pluggable/login";

  pwpAppFrame.src = "https://application.doodle-products.com/login"
 
};
