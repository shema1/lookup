"use strict";



let postCodeInputNew = `

<input lw-tst="input_postalCode" list="postcodes" type="text" autocomplete="off" ng-disabled="sameAsShipping" tabindex="8" ng-model="address.PostCode" ng-change="">

<!----><button ng-if="!isBillingAddres" lw-tst="lookUp_postalCode" type="button" ng-click="lookUp($event,'POSTALCODE', address.PostCode);" class="btn"><i class="fa fa-search"></i></button><!---->

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

define(function(require) {

    const placeholderManager = require("core/placeholderManager");
    const Window = require("core/Window");
    const inventoryService = new Services.InventoryService();

    //const OrderChangeState = require('modules/orderbook/orders/classes/orderchangestate');

    // Set validation there
    $(document).ready(function($scope, $element, $http, $timeout, $compile) {
        const config = { childList: true, subtree: true };

        function searchTree(element, matchingTitle) {
            if (element.innerText == matchingTitle) {
                return element;
            } else if (element.children != null) {
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
            if (resultPostCode ? .parentNode ? .nextElementSibling) {

                return resultPostCode.parentNode.nextElementSibling
            }
            return null
        }

        function searchTreeByAttribute(element, attributeName, attributeValue) {
            console.log("eeeeeleeement", element)
            if (element && element.getAttribute("lw-address-auto--field") === "POSTALCODE") {
                return element;
            } else if (element && element.children != null) {
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
                } else if (element.children != null) {
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
            } else if (element.children != null) {
                var i;
                var result = null;
                for (i = 0; result == null && i < element.children.length; i++) {
                    result = searchTree(element.children[i], matchingTitle);
                }
                return result;
            }
            return null;
        }

        var callback = function(mutationsList, observer) {
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
                            console.log("postCodeInput", postCodeInput)
                            $scope.postcodes = [];
                            $scope.changePostSearch = function() {
                                console.log("woork")
                            }
                            btn = angular.element(postCodeInput);
                            var ctrl = angular.element(btn).controller();

                            btn.replaceWith(postCodeInputNew);

                            btn.on('change', onChnagePostcode)
                        }
                    }
                }

                const onChnagePostcode = function(evn) {
                    console.log("wwwwwww", evn)
                }
            }

        };

        const observer = new MutationObserver(callback);

        setTimeout(function() {
            const targetNode = document.getElementsByClassName("opened-modules")[0];
            observer.observe(targetNode, config);
        }, 2000);
    });



    let openOrderServ1;
    let compIdent1;
    let netInvoiceIdent1;



    var LookupPlaceholder = function($q, $scope, $element, controlService, openOrdersService, $http, $timeout, $compile) {
        console.log("$q", $q);
        console.log("$scope", $scope);
        console.log("$element", $element);
        console.log("$controlService", controlService);
        console.log("$openOrdersService", openOrdersService);

        console.log("$http", $http);
        console.log("$timeout", $timeout);
        console.log("$compile", $compile);

        console.log("this", this);

        const viewModule = angular.module("openOrdersViewService");

        console.log("viewModule", viewModule);

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

        this.initialize = async(data) => {

        }

        this.getItems = function() { return items; }

        this.valueChanged = async function(itemKey, val) {}
    }

    placeholderManager.register("OrderAddress_ShippingFields", LookupPlaceholder);
});