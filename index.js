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
<datalist id="postcodes">
	// <option ng-repeat="item in postcodes" value="{{item}}">
    <div class="raised-higher column fill-height scroll-y-auto white">
    <div ng-repeat="item in postcodes" ng-class="{'grey': ($index % 2) == 0, 'white': ($index % 2) == 1 }" class="padding-heavy hover pointer grey" lw-help-tooltip="" text="qwerty, SomeBody co, 1231231231, 123123, UKEY, 12123, 2131, IRAQ" ng-click="$ctrl.on_select_address(item)">
        {{item}}
    <div>
    </div>
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

    // Set validation there
    $(document).ready(function ($scope, $element, $http, $timeout, $compile) {
        const config = { childList: true, subtree: true };
        const UI = require('utils/UI');
        const angular = require('angular');



        var callback = function (mutationsList, observer) {
            console.log("mutationsList", mutationsList)

            function onChangeSubSource() {
                console.log("onChangeSubSource");
            };

            for (const mutation of mutationsList) {
                if (mutation.type === "childList") {
                    for (const node of mutation.addedNodes) { }
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

    placeholderManager.register("OrderAddress_ShippingFields", LookupPlaceholder);
});