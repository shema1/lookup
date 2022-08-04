"use strict";



let postCodeList = `
<style>
        address-auto-complete-control {
            position: absolute;
            width: 300px;
            height: 280px;
            z-index: 20;
        }
    </style>
    <div class="raised-higher column fill-height scroll-y-auto white">
    <div ng-repeat="item in postcodes" ng-class="{'grey': ($index % 2) == 0, 'white': ($index % 2) == 1 }" class="padding-heavy hover pointer grey" ng-click="$ctrl.on_select_address(item)">
        {{item}}
    <div>
    </div>
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



let postCodeInputNew = null

define(function (require) {

    const placeholderManager = require("core/placeholderManager");

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

        function searchTreeByAttribute(element) {
            if (element?.getAttribute("address-auto-complete-field") == "POSTALCODE") {
                postCodeInputNew = element
                return element;
            }
            if (element && element?.children != null) {
                var i;
                var result = null;
                for (i = 0; result == null && i < element.children.length; i++) {
                    result = searchTreeByAttribute(element.children[i]);
                }
                return result;
            }
            return null;
        }

        const onChangePostSearch = function (event) {
            console.log("event work", event)
        }


        var callback = function (mutationsList, observer) {
            console.log("mutationsList", mutationsList);

            for (const mutation of mutationsList) {
                if (mutation.type === "childList") {
                    for (const node of mutation.addedNodes) {

                        searchTreeByAttribute(node)
                        if (postCodeInputNew) {
                            console.log("postCodeInputNew postCodeInputNew", postCodeInputNew)
                            const input = angular.element(postCodeInputNew)
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
        console.log("$scope", $scope);
        console.log("$scope.address", $scope.address);

        const viewModule = angular.module("openOrdersViewService");

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


        const changePostSearch = function (scope) {
            console.log("changePostSearch wooork")
            let postalCode = "e";

            $http({

                method: 'GET',

                url: 'https://postcodelookup.prodashes.com/autocomplete',

                params: { postalCode }

            }).then(function (response) {

                const data = response.data;

                $timeout(function () {

                    scope.$apply(function () {
                        console.log("data", data)
                        scope.$ctrl.addresses = data
                        scope.postcodes = data;
                        // scope.postcodes = data || [];
                        // scope.selectedPostcode = undefined;

                    });
                })

            });
        };

        viewModule.directive('div', function () {
            return {
                link: function (scope, elem, attrs) {
                    // console.log("scopeeeeee", scope);
                    // console.log("elem", elem);
                    // console.log("bbbbbb", scope.address);

                    if (elem[0]?.className === 'new-screen' && scope.$ctrl.field === 'POSTALCODE') {
                        console.log("scopeeeeee", scope);
                        console.log("elem", elem);
                        console.log("teper tut", postCodeInputNew)
                        elem.empty();

                        elem.append($compile(postCodeList)(scope));


                        $timeout(function () {

                            scope.$apply(function () {
                                scope.postcodes = [];
                            });

                        });

                        $timeout(function () {
                            console.log("woork")
                            changePostSearch(scope)
                            // scope.$apply(function () {
                            //     scope.addresses = []
                            // });
                        });
                        console.log("scopeeeeee v2", scope);
                    }
                }
            }
        })
    }

    placeholderManager.register("OpenOrders_OrderControlButtons", LookupPlaceholder);
});