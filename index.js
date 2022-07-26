







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

//const { ifError } = require("assert");

//const { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } = require("constants");


let postCodeInputNew = `

<input lw-tst="input_postalCode" type="text" autocomplete="off"  tabindex="8" ng-model="address.PostCode" >

<!----><button  ng-if="!isBillingAddres"  id="postcodeBtn" lw-tst="lookUp_postalCode" type="button" ng-click="lookUp($event,'POSTALCODE', address.PostCode);" class="btn"><i class="fa fa-search"></i></button><!---->

<datalist id="postcodes">

	<option ng-repeat="item in postcodes" value="{{item}}">

</datalist>

`;

const lookupControlNew = `

<div class="control-group">

    <label class="control-label">Lookup</label>

    <div class="controls controls-row">

        <div class="input-append">

            <input id="lookupAddressesInput" list="lookupAddresses" type="text" autocomplete="off"

                ng-disabled="sameAsShipping || !selectedPostcode" tabindex="-1" ng-model="lookupAddress" ng-change="changeLookupAddress()">

            <datalist id="lookupAddresses">

				<option ng-repeat="item in lookupAddresses" value="{{item.formatted}}">

            </datalist>

        </div>

    </div>

</div>

`;

define(function (require) {

    const placeholderManager = require("core/placeholderManager");
    const Window = require("core/Window");
    const inventoryService = new Services.InventoryService();

    //const OrderChangeState = require('modules/orderbook/orders/classes/orderchangestate');

    // Set validation there
    $(document).ready(function ($scope) {
        const config = { childList: true, subtree: true };

        function searchTree(element, matchingTitle) {
            if (element.innerText == matchingTitle) {
                return element;
            }
            else if (element.children != null) {
                var i;
                var result = null;
                for (i = 0; result == null && i < element.children.length; i++) {
                    result = searchTree(element.children[i], matchingTitle);
                }
                return result;
            }
            return null;
        }

        function getPostCodeInput(element) {
            const resultPostCode = searchTree(element, "Postcode");
            if (resultPostCode?.parentNode?.nextElementSibling) {

                return resultPostCode.parentNode.nextElementSibling
            }
            return null
        }

        function searchTreeByAttribute(element, attributeName, attributeValue) {
            console.log("eeeeeleeement", element)
            if (element && element?.getAttribute("lw-address-auto--field") === "POSTALCODE") {
                return element;
            }
            else if (element && element.children != null) {
                var i;
                var result = null;
                for (i = 0; result == null && i < element.children.length; i++) {
                    result = searchTree(element.children[i]);
                }
                return result;
            }
            return null;
        }

        function searchTreeIncludes(element, matchingTitle) {
            if (element) {
                if (element.innerText) {
                    if (element.innerText.includes(matchingTitle)) {
                        return element;
                    }
                }
                else if (element.children != null) {
                    var i;
                    var result = null;
                    for (i = 0; result == null && i < element.children.length; i++) {
                        result = searchTree(element.children[i], matchingTitle);
                    }
                    return result;
                }
            }
            return null;
        }

        function searchTreeWithParent(element, matchingTitle, parentNodeName) {
            if (element.innerText == matchingTitle && element.parentNode.parentNode.parentNode.parentNode.innerText.includes(parentNodeName)) {
                return element;
            }


            else if (element.children != null) {
                var i;
                var result = null;
                for (i = 0; result == null && i < element.children.length; i++) {
                    result = searchTree(element.children[i], matchingTitle);
                }
                return result;
            }
            return null;
        }

        var callback = function (mutationsList, observer) {
            console.log("mutationsList", mutationsList)
            function onChangeSubSource() {
                console.log("onChangeSubSource");
            };

            for (const mutation of mutationsList) {
                if (mutation.type === "childList") {
                    for (const node of mutation.addedNodes) {

                        const countryInput = searchTree(node, 'Country')

                        const postCodeInput = getPostCodeInput(node)
                        var btn = null

                        if (countryInput && countryInput.nodeName === "DIV") {
                            countryInput.insertAdjacentHTML('beforebegin', lookupControlNew)
                        }

                        if (postCodeInput) {
                            btn = angular.element(postCodeInput);
                            var ctrl = angular.element(btn).controller();
                            $scope.postcodes = [];

                            btn.replaceWith(postCodeInputNew);
                        }

                        // //Find close button
                        // var closeBtn = searchTree(node, "Close");

                        // if (closeBtn) {
                        //     console.log('fuck');
                        //     closeBtn.parentNode.id = "OpenOrderCloseButton";

                        //     var close_scp = angular.element(closeBtn).scope();
                        //     close_scp.validateEmail = (EmailAddress) => {
                        //         console.log(EmailAddress);
                        //         console.log(Boolean(EmailAddress.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)));

                        //         return Boolean(EmailAddress.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/));

                        //     };


                        //     close_scp.whatToFill = (order) => {
                        //         var t = close_scp.validateEmail("asdkfjlasdjflk");
                        //         var list = [];

                        //         // Shipping address
                        //         var address = order.CustomerInfo.Address;

                        //         //var isValidAddress = address.EmailAddress.length > 1 && isValidEmailAddress && address.Address1.length > 1 && address.Town.length > 1
                        //         //                              && address.PostCode.length > 1 && (address.Company.length > 1 || address.FullName.length > 1);

                        //         if (address.EmailAddress.length <= 1 || !close_scp.validateEmail(address.EmailAddress)) {
                        //             list.push("Shipping address: Valid Email");
                        //         }

                        //         if (address.Address1.length <= 1) {
                        //             list.push("Shipping address: Address1");
                        //         }

                        //         if (address.Town.length <= 1) {
                        //             list.push("Shipping address: Town");
                        //         }

                        //         if (address.PostCode.length <= 1) {
                        //             list.push("Shipping address: PostCode");
                        //         }

                        //         if (address.Company.length <= 1 && address.FullName.length <= 1) {
                        //             list.push("Shipping address: Company or name");
                        //         }


                        //         // Billing address
                        //         address = order.CustomerInfo.BillingAddress;

                        //         if (address.EmailAddress.length <= 1 || !close_scp.validateEmail(address.EmailAddress)) {
                        //             list.push("Billing address: Valid Email");
                        //         }

                        //         if (address.Address1.length <= 1) {
                        //             list.push("Billing address: Address1");
                        //         }

                        //         if (address.Town.length <= 1) {
                        //             list.push("Billing address: Town");
                        //         }

                        //         if (address.PostCode.length <= 1) {
                        //             list.push("Billing address: PostCode");
                        //         }

                        //         if (address.Company.length <= 1 && address.FullName.length <= 1) {
                        //             list.push("Billing address: Company or name");
                        //         }

                        //         // Subsource
                        //         if (order.GeneralInfo.SubSource == '' || order.GeneralInfo.SubSource == null) {
                        //             list.push("Subsource");
                        //         }

                        //         // 1 item
                        //         if (order.Items == null || order.Items.length <= 0) {
                        //             list.push("at least 1 order item");
                        //         }

                        //         // create ordered list: 
                        //         var result = "";
                        //         for (var i = 0; i < list.length; ++i) {
                        //             result += (i + 1) + ". " + list[i] + "\n";
                        //         }

                        //         alert("Please, fill next fileds: \n" + result);

                        //     };

                        //     //angular.element(closeBtn.parentNode).attr('id', );
                        // }

                        // var postcode = searchTree(node, " Postcode ");
                        // console.log("postcode", postcode)


                        // // Find SAVE button
                        // var saveTxt = searchTree(node, " Save");
                        // if (saveTxt) {
                        //     var btn = angular.element(saveTxt.parentNode);



                        //     var newBtn = `<button class="primary wide" 
                        //                         onclick="

                        //                         var e = document.getElementById('OpenOrderCloseButton'); 
                        //                         if(e)
                        //                         {
                        //                             var scp = angular.element(e).scope();

                        //                             var address = scp.order.CustomerInfo.Address;

                        //                             // TODO - Email validation

                        //                             var isValidEmailAddress = scp.validateEmail(address.EmailAddress);

                        //                             var isValidAddress = address.EmailAddress.length > 1 && isValidEmailAddress && address.Address1.length > 1 && address.Town.length > 1
                        //                                         && address.PostCode.length > 1 && (address.Company.length > 1 || address.FullName.length > 1);

                        //                             address = scp.order.CustomerInfo.BillingAddress;

                        //                             var isValidEmailBillingAddress = scp.validateEmail(address.EmailAddress);

                        //                             var isValidBilling = address.EmailAddress.length > 1 && isValidEmailBillingAddress && address.Address1.length > 1 && address.Town.length > 1
                        //                                 && address.PostCode.length > 1 && (address.Company.length > 1 || address.FullName.length > 1);

                        //                             var haveItems = scp.order.Items != null && scp.order.Items.length > 0;

                        //                             var isGeneralInfo = scp.order.GeneralInfo.SubSource != '' && scp.order.GeneralInfo.SubSource != null;

                        //                             var is_saving = isValidAddress && isValidBilling && haveItems && isGeneralInfo;
                        //                             if (is_saving)
                        //                             {
                        //                                 scp.saving.save_all();

                        //                                 // Saved.
                        //                                 alert('Saved');
                        //                             }
                        //                             else
                        //                             {
                        //                                 /*
                        //                                 var whatToFill = '';
                        //                                 if(!isValidAddress) { whatToFill += '  Shipping address ';}
                        //                                 if(!isValidBilling) { whatToFill += ' Billing address ';}
                        //                                 if(!haveItems) { whatToFill += ' at least 1 order item ';}
                        //                                 if(!isGeneralInfo) { whatToFill += ' SubSource ';} */
                        //                                 scp.whatToFill(scp.order);

                        //                                 //alert('Please, fill some fields: ' + whatToFill);
                        //                             }

                        //                         }



                        //                         " >
                        //         <!---->
                        //         <span> <i class="fa fa-save"></i> Save ORDER</span><!---->
                        //     </button>`;


                        //     var ctrl = angular.element(btn).controller();

                        //     if (ctrl.options.viewName == "ViewOrder") {
                        //         var scp_new = btn.scope();

                        //         var is_new = scp_new.config.is_new;

                        //         if (is_new) {
                        //             var btn_save = angular.element(saveTxt);
                        //             btn_save.replaceWith(newBtn);
                        //         }
                        //         else {

                        //             btn.replaceWith(newBtn);
                        //         }

                        //     }





                        //     var attrBtn = angular.element(btn).context.getAttribute('ng-disabled');

                        //     var attrBtnClick = angular.element(btn).context.getAttribute('ng-click');

                        //     if (attrBtnClick) {
                        //         // GET btn scope
                        //         var btnScp = angular.element(btn).scope();

                        //         var btnAng = angular.element(btn);

                        //         //btnScp.alert = window.alert;

                        //         // function (arg) {
                        //         //     alert(arg);
                        //         // };

                        //         // $scope.alert = window.alert;

                        //         // btnScp.check_order = function(){
                        //         //     console.log('checking....');
                        //         // };

                        //         // angular.element(btn).attr('ng-click', "check_order()");


                        //     }

                        // }

                        // // Get subsource 
                        // var resultSubSource = searchTreeIncludes(node, "Subsource");

                        // if (resultSubSource) {
                        //     if (!angular.element(resultSubSource).scope().locking.is_locked) {

                        //         $scope.input = resultSubSource.children[0].children[0].children[0].children[1].children[3];

                        //         $scope.selectedSubSource = angular.element(resultSubSource).scope().order.GeneralInfo.SubSource;

                        //         var sources = ["Email", "Phone", "PL Email", "PL Phone"];

                        //         if ($scope.input) {

                        //             var subSourceCmbx = `<br/>
                        //              <select id="cmbxSubSourceOpenOrder" 
                        //                      class="fill-width margin-bottom ng-pristine ng-untouched ng-valid ng-not-empty disabled-transparent"
                        //                      ng-model="order.Generalinfo.SubSource"
                        //                      onchange="var e = document.getElementById('cmbxSubSourceOpenOrder'); angular.element(e.parentNode.children[1]).scope().order.GeneralInfo.SubSource = e.options[e.selectedIndex].text;"
                        //                      required>`;

                        //             subSourceCmbx += `<option value=" "> </option>`;

                        //             for (var i = 0; i < sources.length; i++) {
                        //                 // Add new option
                        //                 if (sources[i] == $scope.selectedSubSource) {
                        //                     subSourceCmbx += `<option value="` + sources[i] + `" selected="selected">` + sources[i] + `</option>`;
                        //                 }
                        //                 else {
                        //                     subSourceCmbx += `<option value="` + sources[i] + `">` + sources[i] + `</option>`;
                        //                 }
                        //             }

                        //             subSourceCmbx += `</select>`;

                        //             angular.element($scope.input).replaceWith(subSourceCmbx);

                        //             var scp = angular.element(document.getElementById('cmbxSubSourceOpenOrder').parentNode.children[1]).scope();
                        //         }
                        //     }
                        // }

                        // //#region Shipping address

                        // // Look for another fields ... 
                        // var resultEmail = searchTree(node, "Email");

                        // var resultAddress = searchTree(node, "Address 1");

                        // var resultPostcode = searchTree(node, "Postcode");
                        // var resultTown = searchTree(node, "Town");

                        // var resultAdd = searchTree(node, "Address");
                        // var resultPhone = searchTree(node, "Phone");
                        // console.log("resultPhone", resultPhone)
                        // var resultPostCode = searchTree(node, "Postcode");


                        // ///
                        // if (resultAdd) {
                        //     if (resultAdd.nextElementSibling.tagName == "INPUT") angular.element(resultAdd).context.setAttribute('style', "font-size:13px!important;");
                        // }

                        // if (resultPhone) {
                        //     if (resultPhone.nextElementSibling.tagName == "INPUT") resultPhone.innerText = "Phone ";
                        // }

                        // if (resultEmail) {
                        //     if (resultEmail.nextElementSibling.tagName == "INPUT") {
                        //         resultEmail.innerText = "*" + resultEmail.innerText;
                        //         angular.element(resultEmail).context.setAttribute('style', "color:red!important;");

                        //         // email address => Cannot be empty (at least 1 character); Standard email validation of structure such as contains @, .
                        //         var emailInput = angular.element(resultEmail.nextElementSibling);
                        //         emailInput.context.setAttribute('minlength', '1');
                        //         emailInput.attr("required", "required");
                        //         emailInput.attr("type", "email");
                        //     }
                        // }


                        // // Address 1, Town, Postcode => Cannot be empty (at least 1 character)
                        // if (resultAddress) {
                        //     if (resultAddress.nextElementSibling.tagName == "INPUT") {
                        //         resultAddress.innerText = "*" + resultAddress.innerText;
                        //         angular.element(resultAddress).context.setAttribute('style', "color:red!important;");
                        //         var addInput = angular.element(resultAddress.nextElementSibling);
                        //         addInput.context.setAttribute('minlength', '1');
                        //         addInput.attr("required", "required");
                        //     }
                        // }

                        // if (resultPostcode) {
                        //     if (resultPostcode.nextElementSibling.tagName == "INPUT") {
                        //         resultPostcode.innerText = "*" + resultPostcode.innerText;
                        //         angular.element(resultPostcode).context.setAttribute('style', "color:red!important;");

                        //         var codeInput = angular.element(resultPostcode.nextElementSibling);
                        //         codeInput.context.setAttribute('minlength', '1');
                        //         codeInput.attr("required", "required");
                        //     }
                        // }

                        // if (resultTown) {
                        //     if (resultTown.nextElementSibling.tagName == "INPUT") {
                        //         resultTown.innerText = "*" + resultTown.innerText;

                        //         angular.element(resultTown).context.setAttribute('style', "color:red!important;");

                        //         var townInput = angular.element(resultTown.nextElementSibling);
                        //         townInput.context.setAttribute('minlength', '1');
                        //         townInput.attr("required", "required");
                        //     }
                        // }
                        // //#endregion

                        // //#region Billing address
                        // // Look for another fields ... 
                        // var resultEmailBilling = searchTreeWithParent(node, "Email", "Billing Address");

                        // var resultAddressBilling = searchTreeWithParent(node, "Address 1", "Billing Address");

                        // var resultPostcodeBilling = searchTreeWithParent(node, "Postcode", "Billing Address");
                        // var resultTownBilling = searchTreeWithParent(node, "Town", "Billing Address");

                        // var resultAddBilling = searchTreeWithParent(node, "Address", "Billing Address");
                        // var resultPhoneBilling = searchTreeWithParent(node, "Phone", "Billing Address");

                        // ///
                        // if (resultAddBilling) angular.element(resultAddBilling).context.setAttribute('style', "font-size:13px!important;");
                        // if (resultPhoneBilling) resultPhoneBilling.innerText = "Phone ";

                        // if (resultEmailBilling && resultEmailBilling.nextElementSibling.tagName == "INPUT") {
                        //     resultEmailBilling.innerText = "*" + resultEmailBilling.innerText;
                        //     angular.element(resultEmailBilling).context.setAttribute('style', "color:red!important;");

                        //     // email address => Cannot be empty (at least 1 character); Standard email validation of structure such as contains @, .
                        //     var emailInput = angular.element(resultEmailBilling.nextElementSibling);
                        //     emailInput.context.setAttribute('minlength', '1');
                        //     emailInput.attr("required", "required");
                        //     emailInput.attr("type", "email");
                        // }


                        // // Address 1, Town, Postcode => Cannot be empty (at least 1 character)
                        // if (resultAddressBilling && resultAddressBilling.nextElementSibling.tagName == "INPUT") {
                        //     resultAddressBilling.innerText = "*" + resultAddressBilling.innerText;
                        //     angular.element(resultAddressBilling).context.setAttribute('style', "color:red!important;");
                        //     var addInput = angular.element(resultAddressBilling.nextElementSibling);
                        //     addInput.context.setAttribute('minlength', '1');
                        //     addInput.attr("required", "required");
                        // }

                        // if (resultPostcodeBilling && resultPostcodeBilling.nextElementSibling.tagName == "INPUT") {
                        //     resultPostcodeBilling.innerText = "*" + resultPostcodeBilling.innerText;
                        //     angular.element(resultPostcodeBilling).context.setAttribute('style', "color:red!important;");

                        //     var codeInput = angular.element(resultPostcodeBilling.nextElementSibling);
                        //     codeInput.context.setAttribute('minlength', '1');
                        //     codeInput.attr("required", "required");
                        // }

                        // if (resultTownBilling && resultTownBilling.nextElementSibling.tagName == "INPUT") {
                        //     resultTownBilling.innerText = "*" + resultTownBilling.innerText;

                        //     angular.element(resultTownBilling).context.setAttribute('style', "color:red!important;");

                        //     var townInput = angular.element(resultTownBilling.nextElementSibling);
                        //     townInput.context.setAttribute('minlength', '1');
                        //     townInput.attr("required", "required");
                        // }
                        //#endregion
                    }
                }
            }

        };

        const observer = new MutationObserver(callback);

        setTimeout(function () {
            const targetNode = document.getElementsByClassName("opened-modules")[0];
            observer.observe(targetNode, config);
        }, 2000);
    });



    let openOrderServ1;
    let compIdent1;
    let netInvoiceIdent1;



    var LookupPlaceholder = function ($q, $scope, $element, controlService, openOrdersService) {
        const items = [{
            key: "shippingAddressPH",
            labelClass: "hidden",
            inputClass: "hidden",
            label: "",
            onBlurMethod: "valueChanged",
            text: ""
        }];

        let orderScope = $scope.$parent.$parent.$parent;
        openOrderServ1 = openOrdersService;

        this.initialize = async (data) => {
            if (checkIdentifierExists1(orderScope, 'ORDER_COMPLETE') && checkIdentifierExists1(orderScope, 'NET_INVOICE') && orderScope.order.GeneralInfo.Source === "DIRECT") {
                setCompleteButton1(orderScope, $element);
            }
        }

        this.getItems = function () { return items; }

        this.valueChanged = async function (itemKey, val) { }
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





                var e = document.getElementById('OpenOrderCloseButton');
                if (e) {
                    var scp = angular.element(e).scope();

                    var address = scp.order.CustomerInfo.Address;

                    // TODO - Email validation

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
                                <button class="green" style="" id="completeOdrBtn" ng-disabled="saving.is_saving()" title="CompleteNEW"><i class="fa fa-check"></i> CompleteNEW</button>
                            </div>`;

    placeholderManager.register("OrderAddress_ShippingFields", LookupPlaceholder);
});
