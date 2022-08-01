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


var LookupPlaceHolder = function($scope, $element, $http, $timeout, $compile) {

    console.log("$scope", $scope);
    console.log("$element", $element);
    console.log("$http", $http);
    console.log("$timeout", $timeout);
    console.log("$compile", $compile);

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


    this.initialize = async(data) => {

    }

    this.getItems = function() { return items; }

    this.valueChanged = async function(itemKey, val) {}

    viewModule.directive('div', function() {
        return {
            link: function(scope, elem, attrs) {
                console.log("scopeeeeee", scope);
                console.log("elem", elem);
            }
        }
    })

}

Core.PlaceHolderManager.register("OrderAddress_ShippingFields", LookupPlaceHolder);