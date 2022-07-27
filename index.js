"use strict";

let postCodeInputNew = `
<div ng-class="{'translucent margin-none margin-top': $ctrl.isLocked}">
                    <!----><h6 ng-if="!$ctrl.isLocked">
                        Postcode
                    </h6><!---->
                    <!---->
                </div>
<input lw-tst="input_postalCode" list="postcodes" type="text" autocomplete="off" class='disabled-transparent ng-pristine ng-valid ng-empty ng-touched' ng-disabled="sameAsShipping" tabindex="8" ng-model="address.PostCode" ng-change="changePostSearch()">

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

var PlaceHolder = function($scope, $element, $http, $timeout, $compile) {


    this.getItems = function() {
        //this is for fuzz, because he forgot to let me know that function should return empty array
        return []
            //specially for fuzz and nik :)
    }

    let debounceTimer = null;

    const viewModule = angular.module("openOrdersViewService");
    console.log("viewModule", viewModule);

    function getPostCode(element, matchingTitle) {

        if (element.getAttribute("address-auto-complete-field") === "POSTALCODE") {
            return element;
        } else if (element.children != null) {
            var i;
            var result = null;
            for (i = 0; result == null && i < element.children.length; i++) {
                result = getPostCode(element.children[i], matchingTitle);
            }
            return result;
        }
        return null;
    }

    viewModule.directive("div", function() {
        return {
            link: function(scope, elem, attrs) {
                // console.log("elem", elem)

                const postCode = getPostCode(elem[0], "ssss")
                if (postCode) {
                    console.log("postCode", postCode)
                }

                if (postCode) {
                    console.log("elem", elem)
                    console.log("elem[0].parentElement.parentElement", elem[0].parentElement.parentElement)
                        // elem.empty();

                    // elem.append($compile(postCodeInputNew)(scope));

                    $($compile(postCodeInputNew)(scope)).insertAfter(elem[0].parentElement);
                    $($compile(lookupControlNew)(scope)).insertAfter(elem[0].parentElement);



                    // $($compile(lookupControlNew)(scope)).insertAfter(elem[0].parentElement.parentElement);

                }
            }
        }
    })

}

Core.PlaceHolderManager.register("OpenOrders_OrderControlButtons", PlaceHolder);