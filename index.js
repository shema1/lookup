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

    const angular = require("angular");
    const template = require("text!./addressAutoCompleteControl.html");
    console.log("template", template);

    const ngModule = angular.module("addressAutoCompleteControl", []);
    console.log("ngModule", ngModule);

    ngModule.component(ngModule.name, {
        template,
        require: {
            control: '^'
        },
        controller: function ($scope) {
            this.field = "NAME";

            this.$onInit = function () {
                this.addresses = this.control.data.addresses;
                this.field = this.control.data.field;

                $scope.$on(`notifyControl:${this.control.id}:address`, (event, data) => {
                    this.addresses = data;
                    $scope.$apply();
                });
            }

            this.on_select_address = function (address) {
                this.control.close(address);
            }

            this.get_address_field_value = function (address) {
                switch (this.field) {
                    case "NAME":
                    case "FULLNAME":
                        return address.FullName;

                    case "COMPANY":
                        return address.Company;

                    case "ADDRESS1":
                        return address.Address1;

                    case "POSTALCODE":
                        return address.PostCode;

                    case "TELEPHONE":
                        return address.PhoneNumber;

                    case "EMAIL":
                        return address.EmailAddress;
                }
            }

            this.get_address_string = function (address) {

                var self = this;

                var address_parts = [];

                let add_to_address = function (field_name, data) {
                    if (data != null && data != '' && field_name != self.field)
                        address_parts.push(data);
                }

                add_to_address("NAME", address.FullName);
                add_to_address("COMPANY", address.Company);
                add_to_address("ADDRESS1", address.Address1);
                add_to_address("ADDRESS2", address.Address2);
                add_to_address("ADDRESS3", address.Address3);
                add_to_address("TOWN", (address.Town || "").toUpperCase());
                add_to_address("REGION", (address.Region || "").toUpperCase());
                add_to_address("POSTCODE", (address.PostCode || "").toUpperCase());
                add_to_address("COUNTRY", (address.Country || "").toUpperCase());

                return address_parts.join(", ");
            }
        }
    });

    return {
        exports: ngModule.name,
        selector: "address-auto-complete-control"
    };

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
    }

    placeholderManager.register("OrderAddress_ShippingFields", LookupPlaceholder);
});