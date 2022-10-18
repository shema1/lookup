var IframeView = function ($scope) {
  console.log("scope iframe", $scope)

  const orderInfo = localStorage.getItem('move_cancel_selected_order_info');

  console.log("test iframe orderInfo", orderInfo);
  // $scope.purchaseNumber = localStorage.getItem('pwp-purchase-number');
  // $scope.purchaseAmount = localStorage.getItem('pwp-purchase-amount');

  // const session = JSON.parse(window.localStorage.getItem('SPA_auth_session'));
  // $scope.userId = session.userId;
  var pwpAppFrame = document.getElementById("appFrame");

  console.log("pwpAppFrame", pwpAppFrame)
  // // TODO: replace base URL in production!
  // var baseUrl = "https://pwp-test.herokuapp.com/";

  // var frameUlr = baseUrl + "pluggable/login";

  pwpAppFrame.src = `http://localhost:2000/?token=6c324e9a-bf7d-adb4-900d-eb4420a1e02d&orderId=${orderInfo.OrderId}&email=akornytskyi@brainence.com`

};
