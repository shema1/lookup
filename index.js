"use strict";



let postCodeInputNew = `

<input id="test123" lw-tst="input_postalCode" list="postcodes" type="text" autocomplete="off" ng-disabled="sameAsShipping" tabindex="8" ng-model="address.PostCode" ng-change="changePostSearch()">

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

define(function (require) {

    const placeholderManager = require("core/placeholderManager");
    const Window = require("core/Window");
    const inventoryService = new Services.InventoryService();

    //const OrderChangeState = require('modules/orderbook/orders/classes/orderchangestate');

    // Set validation there
    $(document).ready(function ($scope, $element, $http, $timeout, $compile) {
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
            if (resultPostCode?.parentNode?.nextElementSibling) {

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


        const onChangePostSearch = function (event) {
            console.log('event', event)
            console.log("changePostSearch work", $scope)
            console.log("test scope address", $scope.address);

            // debounceTimer && $timeout.cancel(debounceTimer);

            // debounceTimer = $timeout(function() {

            //     const postalCode = scope.address.PostCode;

            //     const postcodes = scope.postcodes;



            //     if (postcodes && postcodes.some(x => x === postalCode)) {

            //         findAddresses(postalCode);

            //     } else {

            //         $timeout(function() {

            //             scope.$apply(function() {

            //                 scope.postcodes = [];

            //             });

            //         });

            //         $http({

            //             method: 'GET',

            //             url: 'https://postcodelookup.prodashes.com/autocomplete',

            //             params: { postalCode }

            //         }).then(function(response) {

            //             const data = response.data;

            //             console.log("changePostSearch", data)

            //             $timeout(function() {

            //                 scope.$apply(function() {

            //                     scope.postcodes = data || [];

            //                     scope.selectedPostcode = undefined;

            //                 });

            //                 // $timeout(function() {
            //                 //     console.log("data.some(x => x === postalCode)", data.some(x => x === postalCode))
            //                 //     if (data && Array.isArray(data) && data.some(x => x === postalCode)) {

            //                 //         findAddresses(postalCode);

            //                 //     }

            //                 // });

            //             })

            //         });

            //     }

            // }, DEBOUNCE_TIME_NEW);

        };

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
                            console.log("postCodeInput", postCodeInput)
                            $scope.postcodes = [];
                            btn = angular.element(postCodeInput);
                            btn.replaceWith(postCodeInputNew);

                            var e = document.getElementById('test123');
                            const input = angular.element(e)
                            input.on('keyup', onChangePostSearch)
                        }
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


    var LookupPlaceholder = function ($q, $scope, $element, controlService, openOrdersService, $http, $timeout, $compile) {
        console.log("$scope 2", $scope);
        console.log("$element 2", $element);
        console.log("$scope.address", $scope.address);



        const viewModule = angular.module("openOrdersViewService");

        console.log("viewModule", viewModule);


        $timeout(function () {

            $scope.$apply(function () {

                $scope.postcodes = [];

                $scope.lookupAddresses = [];

                $scope.selectedPostcode = "test";


            });

        });

        const items = [{
            key: "shippingAddressPH",
            labelClass: "hidden",
            inputClass: "hidden",
            label: "",
            onBlurMethod: "valueChanged",
            text: ""
        }];



        this.initialize = async (data) => {

        }

        this.getItems = function () { return items; }

        this.valueChanged = async function (itemKey, val) { }

        viewModule.directive('div', function () {
            return {
                link: function (scope, elem, attrs) {
                    console.log("scopeeeeee", scope);
                    console.log("elem", elem);
                    console.log("bbbbbb", scope.address);
                }
            }
        })

    }

    placeholderManager.register("OrderAddress_ShippingFields", LookupPlaceholder);
});