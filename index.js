let postCodeInputNew = `

<input lw-tst="input_postalCode" list="postcodes" type="text" autocomplete="off" ng-disabled="sameAsShipping" tabindex="8" ng-model="address.PostCode" ng-change="changePostSearch()">

<!----><button ng-if="!isBillingAddres" lw-tst="lookUp_postalCode" type="button" ng-click="lookUp($event,'POSTALCODE', address.PostCode);" class="btn"><i class="fa fa-search"></i></button><!---->

<datalist id="postcodes">

	<option ng-repeat="item in postcodes" value="{{item}}">

</datalist>

`;



const lookupControlNew = `

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



const DEBOUNCE_TIME_NEW = 500;


define(function (require) {

    const placeholderManager = require("core/placeholderManager");

    var PlaceHolder = function ($scope, $element, $http, $timeout, $compile) {


        this.getItems = function () {
            //this is for fuzz, because he forgot to let me know that function should return empty array
            return [
                {
                    key: "test",
                    labelClass: "hidden",
                    inputClass: "hidden",
                    label: "",
                    onBlurMethod: "valueChanged",
                    text: ""
                }
            ];
            //specially for fuzz and nik :)
        }

        this.initialize = async (data) => {

        }

        this.valueChanged = async function (itemKey, val) { }

        let debounceTimer = null;

        const viewModule = angular.module("openOrdersViewService");
        console.log("viewModule", viewModule);


        viewModule.directive("div", function () {

            return {
                link: function (scope, elem, attrs) {
                    console.log("elem", elem)
                }
            }

        });

    }

    placeHolderManager.register("OrderAddress_ShippingFields", PlaceHolder);

});
