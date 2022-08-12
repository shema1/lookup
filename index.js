"use strict";


let postCodeInputNewInput = `

<input id="postCodeInput" lw-tst="input_postalCode" list="postcodes" type="text" autocomplete="off" tabindex="8"
  ng-model="$ctrl.address.PostCode" ng-change="changePostSearch()"
  class="fill-width disabled-transparent ng-pristine ng-valid ng-not-empty ng-touched" ng-blur="blur($event)">

<div style="position: relative;height: 160px;" ng-show="isVisibleResults" >
<div class="raised-higher column fill-height scroll-y-auto white" >
  <div ng-click="selectPostCode(item)" ng-repeat="item in postcodes track by $index"
    ng-class="{'grey': ($index % 2) == 0, 'white': ($index % 2) == 1 }" class="padding-heavy hover pointer grey"
   >
    <div>
      {{item}}
    </div>
  </div>
</div>
</div>
`

const lookupControlNewInput = `

<div ng-class="{'translucent margin-none margin-top': $ctrl.isLocked}">
<!---->
<h6 ng-if="!$ctrl.isLocked">
  Lookup
</h6>
<!---->
<!---->
</div>
<input id="lookupAddressesInput" list="lookupAddresses" type="text" autocomplete="off"
ng-disabled="!selectedPostcode" tabindex="-1" ng-model="lookupAddress"
ng-change="changeLookupAddress()"
class="fill-width disabled-transparent ng-pristine ng-valid ng-not-empty ng-touched" ng-blur="onBlurLookup($event)">
<div style="position: relative;height: 160px;" ng-show="isVisibleLookUpResults">
<div class="raised-higher column fill-height scroll-y-auto white">
<div ng-click="onSelectLookup(lookup.formatted)" ng-repeat="lookup in lookupAddresses track by $index"
  ng-class="{'grey': ($index % 2) == 0, 'white': ($index % 2) == 1 }" class="padding-heavy hover pointer grey">
  <div>
    {{lookup.formatted}}
  </div>
</div>
</div>
</div>

`;



let postCodeInputNew = null

const DEBOUNCE_TIME_NEW = 500

define(function (require) {

    const placeholderManager = require("core/placeholderManager");

    // Set validation there

    var LookupPlaceholder = function ($scope, $element, controlService, openOrdersService, $http, $timeout, $compile) {
        const viewModule = angular.module("openOrdersViewService");
        const scope = $scope.$parent.$parent
        let debounceTimer = null;

        const items = [{
            key: "shippingAddressPH",
            labelClass: "hidden",
            inputClass: "hidden",
            label: "",
            onBlurMethod: "valueChanged",
            text: ""
        }];

        $timeout(function () {

            scope.$apply(function () {
                scope.postcodes = [];

                scope.lookupAddresses = [];

                scope.selectedPostcode = undefined;

                scope.isVisibleResults = false
                scope.isVisibleLookUpResults = false

                scope.lookupAddress = "";
            });

        });

        $timeout(function () {
            const inputs = document.querySelectorAll('[address-auto-complete-field="POSTALCODE"]')

            if (inputs[1]) {
                $($compile(lookupControlNewInput)(scope)).insertAfter(angular.element(inputs[1]));
                $($compile(postCodeInputNewInput)(scope)).insertAfter(angular.element(inputs[1]));
                angular.element(inputs[1]).remove()
            }

            if (inputs[0]) {
                $($compile(lookupControlNewInput)(scope)).insertAfter(angular.element(inputs[0]));
                $($compile(postCodeInputNewInput)(scope)).insertAfter(angular.element(inputs[0]));
                angular.element(inputs[0]).remove()
            }

        }, 1000)

        function findAddresses(postalCode) {

            $timeout(function () {

                scope.$apply(function () {

                    scope.lookupAddresses = [];

                });

            });



            $http({

                method: 'GET',

                url: 'https://postcodelookup.prodashes.com/addresses',

                params: { postalCode }

            }).then(function (response) {

                const data = response.data;

                $timeout(function () {

                    scope.$apply(function () {

                        scope.lookupAddresses = data.map(x => Object.assign({}, x, { formatted: `${x.address1}, ${x.address2}, ${x.address3}, ${x.town}, ${x.region}, ${x.country}` }));

                        scope.selectedPostcode = postalCode;

                        // scope.lookupAddress = ""

                    });

                })

            });

        };

        scope.changePostSearch = function (hideResult) {

            debounceTimer && $timeout.cancel(debounceTimer);

            debounceTimer = $timeout(function () {

                const postalCode = scope.$ctrl.address.PostCode;

                const postcodes = scope.postcodes;



                if (postcodes && postcodes.some(x => x === postalCode)) {

                    findAddresses(postalCode);

                    $timeout(function () {
                        scope.$apply(function () {
                            scope.isVisibleResults = true;
                        });
                    });

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

                                scope.isVisibleResults = (!data?.length || hideResult) ? false : true;

                            });

                            $timeout(function () {

                                if (data && Array.isArray(data) && data.some(x => x === postalCode)) {

                                    findAddresses(postalCode);

                                }

                            });

                        })

                    });

                }

            }, DEBOUNCE_TIME_NEW);

        };

        scope.changeLookupAddress = function () {

            const value = scope.lookupAddress;

            const addresses = scope.lookupAddresses;

            const address = addresses.find(x => x.formatted.match(value));

            if (address) {

                $timeout(function () {

                    scope.$apply(function () {
                        scope.isVisibleLookUpResults = true
                    });

                });

            }

        };

        scope.blur = function (e) {
            $timeout(function () {
                scope.$apply(function () {
                    scope.isVisibleResults = false
                });

            }, 200)
        }


        scope.onBlurLookup = function (e) {
            $timeout(function () {
                scope.$apply(function () {
                    scope.isVisibleLookUpResults = false
                });
            }, 200)
        }

        scope.selectPostCode = function (code) {
            findAddresses(code)

            $timeout(function () {
                scope.$apply(function () {
                    scope.$ctrl.address.PostCode = code
                });

            })
        }

        scope.onSelectLookup = function (value) {

            const addresses = scope.lookupAddresses;

            // const value = scope.lookupAddress;

            const address = addresses.find(x => x.formatted === value);

            if (address) {

                const country = address.country;

                const foundCountry = scope.$ctrl.countries.find(c => c.CountryName === country);

                $timeout(function () {

                    scope.$apply(function () {

                        scope.$ctrl.address.Address1 = address.address1;

                        scope.$ctrl.address.Address2 = address.address2;

                        scope.$ctrl.address.Address3 = address.address3;

                        scope.$ctrl.address.Town = address.town;

                        scope.$ctrl.address.Region = address.region;

                        scope.$ctrl.address.CountryId = foundCountry && foundCountry.CountryId;

                        scope.isVisibleLookUpResults = false

                        scope.lookupAddress = value;
                    });

                });

            }
        }

        this.initialize = async (data) => { }

        this.getItems = function () { return items; }

        this.valueChanged = async function (itemKey, val) { }

        viewModule.directive('div', function () {
            return {
                link: function (scope, elem, attrs, watch) {
                }
            }
        })

        $timeout(function() {
            console.log("scope", scope);
  
                  if(scope.$ctrl?.address?.PostCode){
                      console.log("woork", scope.$ctrl?.address?.PostCode);
                      scope.changePostSearch(scope.$ctrl?.address?.PostCode);                        
                      
                  }
                  
          }, 200)

    }




    placeholderManager.register("OrderAddress_ShippingFields", LookupPlaceholder);
});
