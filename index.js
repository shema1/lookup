"use strict";



// let postCodeList = `
// <style>
//         address-auto-complete-control {
//             position: absolute;
//             width: 300px;
//             height: 280px;
//             z-index: 20;
//         }
//     </style>
//     <div class="raised-higher column fill-height scroll-y-auto white">
//     <div ng-repeat="item in postcodes" ng-class="{'grey': ($index % 2) == 0, 'white': ($index % 2) == 1 }" class="padding-heavy hover pointer grey">
//         {{item}}
//     <div>
//     </div>
// `;

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
        <div ng-repeat="item in postcodes" ng-class="{'grey': ($index % 2) == 0, 'white': ($index % 2) == 1 }" class="padding-heavy hover pointer grey">{{item}}</div>
    </div>
`;


let postCodeInputNewInput = `

<input lw-tst="input_postalCode" list="postcodes" type="text" autocomplete="off"  tabindex="8" ng-model="$ctrl.address.PostCode" ng-change="changePostSearch()">

<!----><button ng-if="!isBillingAddres" lw-tst="lookUp_postalCode" type="button" ng-click="lookUp($event,'POSTALCODE', address.PostCode);" class="btn"><i class="fa fa-search"></i></button><!---->

<datalist id="postcodes">

	<option ng-repeat="item in postcodes" value="{{item}}">

</datalist>

`;



const lookupControlNewInput = `

<div class="control-group">

    <label class="control-label">Lookup:</label>

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

const DEBOUNCE_TIME_NEW  = 500

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
                        // var postCodeInput = getPostCodeInput(node)
                        // if (postCodeInput) {
                        //     console.log("postCodeInput", postCodeInput)
                        //     $scope.input = postCodeInput
                        //     const tInput = `<input id="ttest" type="text" ng-model="postcode" onchange="var e = document.getElementById('ttest'); console.log('ttttest', e)">`


                        //     if ($scope.input) {
                        //         const item = angular.element(tInput);
                        //         const itemScope = item.scope()

                        //         // console.log("itemScope v3", itemScope)

                        //         // itemScope.postcode = 'aaaaaa'

                        //         angular.element($scope.input).replaceWith(item)
                        //         console.log("angular.element(tInput)", angular.element(item))
                        //         item.bind('keydown', function ($event) {
                        //             console.log("wwwwwwwooooooork", $event.target.value)
                        //             // console.log("itemScope", angular())

                        //         })
                        //     }

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


    var LookupPlaceholder = function ($scope, $element, controlService, openOrdersService, $http, $timeout, $compile) {
        const viewModule = angular.module("openOrdersViewService");
        const scope = $scope.$parent.$parent
        let debounceTimer = null;

        // console.log("$scope", $scope)
        // console.log("element", $element)
        // console.log("controlService", controlService)
        // console.log("openOrdersService", openOrdersService)
        const items = [{
            key: "ttest",
            labelClass: "fill-width",
            inputClass: "fill-width",
            label: "",
            onBlurMethod: "valueChanged",
            text: ""
        }];

        $timeout(function () {

            scope.$apply(function () {
                scope.postcodes = [];

                scope.lookupAddresses = [];

                scope.selectedPostcode = undefined;
            });

        });

        $timeout(function () {
            const inputs = document.querySelectorAll('[address-auto-complete-field="POSTALCODE"]')
            console.log("inputs", inputs)
            // $($compile(lookupControlNewInput)($scope)).insertAfter(angular.element(result[1]));
            $($compile(postCodeInputNewInput)(scope)).insertAfter(angular.element(inputs[1]));
        }, 1000)

        scope.changePostSearch = function () {

            debounceTimer && $timeout.cancel(debounceTimer);

            debounceTimer = $timeout(function () {

                const postalCode = scope.$ctrl.address.PostCode;

                const postcodes = scope.postcodes;



                if (postcodes && postcodes.some(x => x === postalCode)) {

                    findAddresses(postalCode);

                }

                else {

                    $timeout(function () {

                        scope.$apply(function () {

                            scope.postcodes = [];

                        });

                    });

                    $http({

                        method: 'GET',

                        url: 'https://postcodelookup.prodashes.com/autocomplete',

                        params: { postalCode }

                    }).then(function (response) {

                        const data = response.data;



                        $timeout(function () {

                            scope.$apply(function () {

                                scope.postcodes = data || [];

                                scope.selectedPostcode = undefined;

                            });

                            $timeout(function () {

                                if (data && Array.isArray(data) && data.some(x => x === postalCode)) {

                                    // findAddresses(postalCode);

                                }

                            });

                        })

                    });

                }

            }, DEBOUNCE_TIME_NEW);

        };

        this.initialize = async (data) => { }

        this.getItems = function () { return items; }

        this.valueChanged = async function (itemKey, val) {
            console.log("valueChanged itemKey", itemKey);
            console.log("valueChanged val", val)

        }


        viewModule.directive('div', function () {
            return {
                link: function (scope, elem, attrs, watch) {
                    // console.log("derective elem", elem)
                }
            }
        })
    }

    placeholderManager.register("OrderAddress_ShippingFields", LookupPlaceholder);
});
