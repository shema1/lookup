// let postCodeInputNew = `

// <input lw-tst="input_postalCode" list="postcodes" type="text" autocomplete="off" ng-disabled="sameAsShipping" tabindex="8" ng-model="address.PostCode" ng-change="changePostSearch()">

// <!----><button ng-if="!isBillingAddres" lw-tst="lookUp_postalCode" type="button" ng-click="lookUp($event,'POSTALCODE', address.PostCode);" class="btn"><i class="fa fa-search"></i></button><!---->

// <datalist id="postcodes">

// 	<option ng-repeat="item in postcodes" value="{{item}}">

// </datalist>

// `;



// const lookupControlNew = `

// <div class="control-group">

//     <label class="control-label">Lookup:</label>

//     <div class="controls controls-row">

//         <div class="input-append">

//             <input id="lookupAddressesInput" list="lookupAddresses" type="text" autocomplete="off"

//                 ng-disabled="sameAsShipping || !selectedPostcode" tabindex="-1" ng-model="lookupAddress" ng-change="changeLookupAddress()">

//             <datalist id="lookupAddresses">

// 				<option ng-repeat="item in lookupAddresses" value="{{item.formatted}}">

//             </datalist>

//         </div>

//     </div>

// </div>

// `;



// const DEBOUNCE_TIME_NEW = 500;



// var PlaceHolder = function ($scope, $element, $http, $timeout, $compile) {

//   console.log("wooork");

//   this.getItems = function () {
//     return [{
//       key: "shippingAddressPH",
//       labelClass: "hidden",
//       inputClass: "hidden",
//       onBlurMethod: "valueChanged",
//       label: "",
//       text: ""
//     }
//     ];
//   }
//   this.valueChanged = async function (itemKey, val) {
//     console.log("itemKey", itemKey);
//     console.log("val", val);

//   }

//   this.initialize = async (data) => {
//   }


//   let debounceTimer = null;



//   const viewModule = angular.module("openOrdersViewService");
//   console.log("viewModule", viewModule)

//   viewModule.directive("div", function () {

//     return {

//       link: function (scope, elem, attrs) {
//         console.log("elem", elem);
//         // const test1 = elem[0]?.children[1]?.children[0]?.children[0]?.children[12];

//         // if (test1) {
//         //   console.log("test1", test1)
//         //   console.log("test2", test1.children)
//         //   console.log("test3", test1.children[0])
//         //   console.log("test4", test1.children[1])
//         //   console.log("test5", test1.firstChild)
//         //   console.log("test6", test1.firstChild.ownerDocument.getElementById)
//         //   console.log("test7", test1.firstChild.ownerDocument.querySelectorAll)
//         //   const a = test1.firstChild.ownerDocument.querySelectorAll('[address-auto-complete-field="POSTALCODE"]')
//         //   console.log("test8", a)
//         //   console.log("test9", a.append)
//         // }
//         // console.log("elem[0].children[1].children[0].children[0]", elem[0].children[1].children[0].children[0]);

//         const test2 = elem[0]?.children[0];

//         if (test2) {
//           console.log("test1", test2);
//           console.log("test2", test2.getAttribute("address-auto-complete-field") === "POSTALCODE");
//         }

//         if (elem && elem[0] && elem[0].children[0] && elem[0].children[0].getAttribute("lw-tst") === "input_postalCode") {

//           elem.empty();

//           elem.append($compile(postCodeInputNew)(scope));



//           $($compile(lookupControlNew)(scope)).insertAfter(elem[0].parentElement.parentElement);



//           $timeout(function () {

//             scope.$apply(function () {

//               scope.postcodes = [];

//               scope.lookupAddresses = [];

//               scope.selectedPostcode = undefined;

//             });

//           });



//           function findAddresses(postalCode) {

//             $timeout(function () {

//               scope.$apply(function () {

//                 scope.lookupAddresses = [];

//               });

//             });



//             $http({

//               method: 'GET',

//               url: 'https://postcodelookup.prodashes.com/addresses',

//               params: { postalCode }

//             }).then(function (response) {

//               const data = response.data;



//               $timeout(function () {

//                 scope.$apply(function () {

//                   scope.lookupAddresses = data.map(x => Object.assign({}, x, { formatted: `${x.address1}, ${x.address2}, ${x.address3}, ${x.town}, ${x.region}, ${x.country}` }));

//                   scope.selectedPostcode = postalCode;

//                   scope.lookupAddress = ""

//                 });

//               })

//             });

//           };



//           scope.changePostSearch = function () {

//             debounceTimer && $timeout.cancel(debounceTimer);

//             debounceTimer = $timeout(function () {

//               const postalCode = scope.address.PostCode;

//               const postcodes = scope.postcodes;



//               if (postcodes && postcodes.some(x => x === postalCode)) {

//                 findAddresses(postalCode);

//               }

//               else {

//                 $timeout(function () {

//                   scope.$apply(function () {

//                     scope.postcodes = [];

//                   });

//                 });

//                 $http({

//                   method: 'GET',

//                   url: 'https://postcodelookup.prodashes.com/autocomplete',

//                   params: { postalCode }

//                 }).then(function (response) {

//                   const data = response.data;



//                   $timeout(function () {

//                     scope.$apply(function () {

//                       scope.postcodes = data || [];

//                       scope.selectedPostcode = undefined;

//                     });

//                     $timeout(function () {

//                       if (data && Array.isArray(data) && data.some(x => x === postalCode)) {

//                         findAddresses(postalCode);

//                       }

//                     });

//                   })

//                 });

//               }

//             }, DEBOUNCE_TIME_NEW);

//           };



//           scope.changeLookupAddress = function (e) {

//             const addresses = scope.lookupAddresses;



//             const value = scope.lookupAddress;

//             const address = addresses.find(x => x.formatted === value);

//             if (address) {

//               const country = address.country;

//               const foundCountry = scope.countries.find(c => c.CountryName === country);

//               $timeout(function () {

//                 scope.$apply(function () {

//                   scope.address.Address1 = address.address1;

//                   scope.address.Address2 = address.address2;

//                   scope.address.Address3 = address.address3;

//                   scope.address.Town = address.town;

//                   scope.address.Region = address.region;

//                   scope.address.CountryId = foundCountry && foundCountry.CountryId;

//                 });

//               });

//             }

//           };

//         }

//       }

//     }

//   });

// }



// Core.PlaceHolderManager.register("OrderAddress_ShippingFields", PlaceHolder);


"use strict";

define(function (require) {
  console.log("wooork v3")

  const placeholderManager = require("core/placeholderManager");
  const Window = require("core/Window");
  const inventoryService = new Services.InventoryService();

  //const OrderChangeState = require('modules/orderbook/orders/classes/orderchangestate');

  // Set validation there
  $(document).ready(function ($scope) {

    let a = document.querySelectorAll('[address-auto-complete-field="POSTALCODE"]');
    console.log("a", a);

  });

  let openOrderServ1;
  let compIdent1;
  let netInvoiceIdent1;


  var CompleteButtopPlaceholder2 = function ($q, $scope, $element, controlService, openOrdersService) {
    const items = [{
      key: "shippingAddressPH",
      labelClass: "hidden",
      inputClass: "hidden",
      label: "",
      onBlurMethod: "valueChanged",
      text: ""
    }];

    this.initialize = async (data) => {
      if (checkIdentifierExists1(orderScope, 'ORDER_COMPLETE') && checkIdentifierExists1(orderScope, 'NET_INVOICE') && orderScope.order.GeneralInfo.Source === "DIRECT") {
        setCompleteButton1(orderScope, $element);
      }
    }

    this.getItems = function () { return items; }

    this.valueChanged = async function (itemKey, val) {
      console.log("itemKey", itemKey);
      console.log("val", val);

    }
  }

  function checkIdentifierExists1(orderScope, tag) {
    if (IsNullOrEmpty1(compIdent1) || IsNullOrEmpty1(netInvoiceIdent1)) {
      for (const [key, value] of Object.entries(orderScope.identifiers.identifiers)) {
        if (value.Tag === tag && tag === 'ORDER_COMPLETE') {
          compIdent1 = value;
          return true;
        }
        else if (value.Tag === tag && tag === 'NET_INVOICE') {
          netInvoiceIdent1 = value;
          return true;
        }
      }
      return false;
    } else {
      return true;
    }
  }

  function isIdentifierAssigned1(localScope, tag) {
    for (let i = 0; i < localScope.order.GeneralInfo.Identifiers.length; i++) {
      if (localScope.order.GeneralInfo.Identifiers[i].Tag === tag) {
        return true;
      }
    }
    return false;
  }

  function setCompleteButton1(localScope, $element) {
    let completeOdrBtn = angular.element($element).find('#completeOdrBtn');
    if (completeOdrBtn[0] === undefined || completeOdrBtn[0] === null) {
      setBtnLogic($element, 'completeOdrBtn');
      let completeOdrBtn = angular.element($element).find('#completeOdrBtn');
      completeOdrBtn[0].onclick = async function () {
        this.disabled = true;
        var scp = angular.element(this).scope();

        if (scp) {

          var address = scp.order.CustomerInfo.Address;

          var isValidEmailAddress = scp.validateEmail(address.EmailAddress);

          var isValidAddress = address.EmailAddress.length > 1 && isValidEmailAddress && address.Address1.length > 1 && address.Town.length > 1
            && address.PostCode.length > 1 && (address.Company.length > 1 || address.FullName.length > 1);

          address = scp.order.CustomerInfo.BillingAddress;

          var isValidEmailBillingAddress = scp.validateEmail(address.EmailAddress);

          var isValidBilling = address.EmailAddress.length > 1 && isValidEmailBillingAddress && address.Address1.length > 1 && address.Town.length > 1
            && address.PostCode.length > 1 && (address.Company.length > 1 || address.FullName.length > 1);

          var haveItems = scp.order.Items != null && scp.order.Items.length > 0;

          var isGeneralInfo = scp.order.GeneralInfo.SubSource != '' && scp.order.GeneralInfo.SubSource != null;

          var is_saving = isValidAddress && isValidBilling && haveItems && isGeneralInfo;
          if (is_saving) {
            if (!localScope.locking.is_locked)
              localScope.locking.toggle_locked();

            for (let i = 0; i < localScope.order.Items.length; i++) {
              if (IsNullOrEmpty1(localScope.order.Items[i].AdditionalInfo))
                localScope.order.Items[i].AdditionalInfo = [];
            }
            if (!isIdentifierAssigned1(localScope, 'ORDER_COMPLETE') && !IsNullOrEmpty1(compIdent1)) {
              try {
                await openOrderServ1.assignOrderIdentifier({ order_ids: [localScope.order.OrderId], tag: compIdent1.Tag });
              } catch (e) {
                handleDefaultError("Error Adding Identifier");
                return;
              }
            }

            await localScope.saving.save_all();
            this.disabled = false;
            if (localScope.locking.is_locked)
              localScope.locking.toggle_locked();
            localScope.saving.close();
          }
          else {
            scp.whatToFill(scp.order);
            this.disabled = false;
            return;
          }
        }

      };
    }
  }


  function setBtnLogic($element, button) {
    let navItems = angular.element($element).find('.navigation-item');

    for (let i = navItems.length - 1; i >= 0; i--) {
      if (button === 'completeOdrBtn' && navItems[i].innerText == "Close") {
        navItems[i].parentNode.insertAdjacentHTML('afterbegin', cptOdrString);
      }
    }
  }

  function IsNullOrEmpty1(val) {
    return val === undefined || val === null || val === "";
  }

  function HandleError1(title, error) {
    if (!error) {
      error = title;
      title = "Error";
    }

    controlService.notifyError({
      title: title,
      message: error,
      duration: 3
    });

    var stack = new Error().stack;
    console.error(stack);
  }

  let cptOdrString = `<div class="navigation-item tight">
                              <button class="green" style="" id="completeOdrBtn" ng-disabled="saving.is_saving()" title=" Complete"><i class="fa fa-check"></i> Complete</button>
                          </div>`;

  placeholderManager.register("OrderAddress_ShippingFields", CompleteButtopPlaceholder2);
});
