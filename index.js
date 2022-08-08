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
    <div ng-repeat="item in postcodes" ng-class="{'grey': ($index % 2) == 0, 'white': ($index % 2) == 1 }" class="padding-heavy hover pointer grey">
        {{item}}
    <div>
    </div>
`;

const postCodeInputV2 = `
<input id="postCodeInputV2" type="text" autocomplete="off" address-auto-complete="" address-auto-complete-field="POSTALCODE" address-auto-complete-model="$ctrl.address.PostCode" address-auto-complete-on-item-selected="$ctrl.update_current_address(address)" class="fill-width disabled-transparent ng-valid ng-not-empty ng-dirty ng-valid-parse ng-touched" ng-disabled="$ctrl.isLocked" ng-model="$ctrl.address.PostCode ng-change="changePoscode()">`

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




        var callback = function (mutationsList, observer) {
            console.log("mutationsList", mutationsList);

            for (const mutation of mutationsList) {
                if (mutation.type === "childList") {
                    for (const node of mutation.addedNodes) {

                        searchTreeByAttribute(node)
                        // if (postCodeInputNew) {
                        //     const input = angular.element(postCodeInputNew);
                        //     input.replaceWith(postCodeInputV2);
                        //     console.log("postCodeInputNew postCodeInputNew", postCodeInputNew)
                        //     const input = angular.element(postCodeInputNew)
                        //     input.on('keyup', onChangePostSearch)
                        // }
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


        const changePostSearch = function (value, scope) {
            console.log("changePostSearch wooork", value);
            console.log("changePostSearch scope", scope)

            let postalCode = value;

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

        const onChangePostSearch = function (event, scope) {
            console.log("event work", event)
            console.log("event work", event)

        }

        viewModule.directive('div', function () {
            return {
                link: function (scope, elem, attrs, watch) {
                    // console.log("scopeeeeee", scope);
                    // console.log("elem", elem);
                    // console.log("bbbbbb", scope.address);

                    // console.log("watch3", scope.$watch);


                    if (elem[0]?.className === 'new-screen' && scope.$ctrl.field === 'POSTALCODE') {
                        console.log("scopeeeeee", scope);
                        console.log("elem", elem);

                        // console.log("get_address_field_value", scope.$ctrl.get_address_field_value())
                        elem.empty();
                        elem.append($compile(postCodeList)(scope));

                        const input = angular.element(postCodeInputNew)
                        input.on('keyup', function (event) {
                            console.log("onnnn work")
                            changePostSearch(event.target.value, scope)
                        })
                        
                        
                        console.log("scopeeeeee v2", scope);
                    }
                }
            }
        })
    }

    placeholderManager.register("OrderAddress_ShippingFields", LookupPlaceholder);
});
