var Iframe2View = function ($scope) {
  const orderInfo = JSON.parse(localStorage.getItem('move_cancel_selected_order_info'));
  const session = JSON.parse(window.localStorage.getItem("SPA_auth_session"));
  const token = window.localStorage.getItem("access_token");

  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", `${session.server}/api/extensions/getInstalledExtensions`, false);
  xmlHttp.setRequestHeader('Authorization', `Bearer ${token}`);
  xmlHttp.send(null);
  let allApps = JSON.parse(xmlHttp.responseText);
  let cancellationApp = allApps.find(app => app.Name.includes("CancellationButton"))

  var xmlHttp2 = new XMLHttpRequest();
  xmlHttp2.open("GET", `${session.server}/api/extensions/getTemporaryToken?applicationId=${cancellationApp.ApplicationInstallationId}`, false);
  xmlHttp2.setRequestHeader('Authorization', `Bearer ${token}`);
  xmlHttp2.send(null);
  let AppToken = xmlHttp2.responseText.replaceAll('"', '');
  var appFrame = document.getElementById("appFrame2");


  // appFrame.src = `https://Devcancellationbutton.autonative.com/?token=${AppToken}&orderId=${orderInfo.OrderId}&email=${session.userName}`
  // appFrame.src = `http://localhost:2000/?token=${AppToken}&orderId=${orderInfo.OrderId}&email=${session.userName}`
  appFrame.src = `http://localhost:2000/?token=6c324e9a-bf7d-adb4-900d-eb4420a1e02d&orderId=${orderInfo.OrderId}&email=akornytskyi@brainence.com`

  window.addEventListener('message', function (e) {
    // const data = JSON.parse(e.data);
    // // Where does the message come from
    // const channel = data.channel;
    const test = e;
    console.log("eeeeeee", e)
});
};
