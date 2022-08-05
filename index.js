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
const testDiv = `
<style>
        address-auto-complete-control {
            position: absolute;
            width: 300px;
            height: 280px;
            z-index: 20;
        }
    </style>
    <div class="raised-higher column fill-height scroll-y-auto white">
    <div>
    <p ng-click="testFunc()">v1 {{testName}}</p>
  </div>
    </div>
`
const postCodeInputV2 = `
<input id="postCodeInputV2" type="text" autocomplete="off" address-auto-complete="" address-auto-complete-field="POSTALCODE" address-auto-complete-model="$ctrl.address.PostCode" address-auto-complete-on-item-selected="$ctrl.update_current_address(address)" class="fill-width disabled-transparent ng-valid ng-not-empty ng-dirty ng-valid-parse ng-touched" ng-disabled="$ctrl.isLocked" ng-model="$ctrl.address.PostCode" ng-change="changePoscode($event)">`

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



let postCodeInputNew = null;

let testElem = null;

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

        function searchTest(element) {
            if (element?.classList?.value === "column fill-height scroll-y-auto") {
                testElem = element
                return element;
            }
            if (element && element?.children != null) {
                var i;
                var result = null;
                for (i = 0; result == null && i < element.children.length; i++) {
                    result = searchTest(element.children[i]);
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

                        const postInput = getPostCodeInput(node)
                        if(postInput){
                            console.log("postInput", postInput)
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


    // var LookupPlaceholder = function ($q, $scope, $element, controlService, openOrdersService, $http, $timeout, $compile) {

    //     const viewModule = angular.module("openOrdersViewService");

    //     const items = [{
    //         key: "shippingAddressPH",
    //         labelClass: "hidden",
    //         inputClass: "hidden",
    //         label: "",
    //         onBlurMethod: "valueChanged",
    //         text: ""
    //     }];



    //     this.initialize = async (data) => {

    //     }

    //     this.getItems = function () { return items; }

    //     this.valueChanged = async function (itemKey, val) { }

    //     viewModule.directive('div', function () {
    //         return {
    //             link: function (scope, elem, attrs, watch) {
    //             }
    //         }
    //     })
    // }

    // placeholderManager.register("OrderAddress_ShippingFields", LookupPlaceholder);
});
