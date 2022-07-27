"use strict";

let postCodeInputNew = `

<input lw-tst="input_postalCode" list="postcodes" type="text" autocomplete="off" ng-disabled="sameAsShipping" tabindex="8" ng-model="address.PostCode" ng-change="console.log('woork 2')">

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


const DEBOUNCE_TIME_NEW = 500;

var PlaceHolder = function ($scope, $element, $http, $timeout, $compile) {


    this.getItems = function () {
        return [{
            key: "OrderAddress_ShippingFields",
            labelClass: "hidden",
            inputClass: "hidden",
            onBlurMethod: "valueChanged",
            label: "",
            text: ""
        }
        ];
    }

    this.valueChanged = async function (itemKey, val) {
        console.log("itemKey", itemKey);
        console.log("val", val);

    }

    this.initialize = async (data) => {
    }


    let debounceTimer = null;

    const viewModule = angular.module("openOrdersViewService");
    console.log("viewModule2", viewModule)

    viewModule.directive("div", function () {
        console.log("test")

        return {

            link: function (scope, elem, attrs) {
                console.log("elem", elem);

                // const postCodeInput = searchTree(elem[0]);
                // if (postCodeInput) {
                //     console.log("postCodeInput", postCodeInput);
                // }

                // const country = searchTree(elem[0], 'Country')
                // const postCodeInput = getItemByAttribute(elem[0], 'address-auto-complete-field', 'POSTALCODE')
                // if (postCodeInput) {
                //     postCodeInput.log("postCodeInput", postCodeInput)
                // }
            }

        }

    });

}

Core.PlaceHolderManager.register("OrderAddress_ShippingFields", PlaceHolder);