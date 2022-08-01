"use strict";
let postCodeInputNew = `

<input  lw-tst="input_postalCode" list="postcodes" type="text" autocomplete="off" ng-disabled="sameAsShipping" tabindex="8" ng-model="address.PostCode" ng-change="changePostSearch()">

<!----><button ng-if="!isBillingAddres" lw-tst="lookUp_postalCode" type="button" ng-click="lookUp($event,'POSTALCODE', address.PostCode);" class="btn"><i class="fa fa-search"></i></button><!---->

<datalist id="postcodes">

	<option ng-repeat="item in postcodes" value="{{item}}">

</datalist>

<input type="text" autocomplete="off" address-auto-complete="teeest()" ng-change=changePostSearch() address-auto-complete-field="POSTALCODE" address-auto-complete-model="address.PostCode" address-auto-complete-on-item-selected="update_current_address(address)" class="fill-width disabled-transparent ng-valid ng-not-empty ng-dirty ng-valid-parse ng-touched" ng-disabled="" ng-model="address.PostCode" data-hj-ignore-attributes="">

<input type="text" autocomplete="off" postcode-auto-complete ng-change=changePostSearch() address-auto-complete-field="POSTALCODE" address-auto-complete-model="address.PostCode" address-auto-complete-on-item-selected="update_current_address(address)" class="fill-width disabled-transparent ng-valid ng-not-empty ng-dirty ng-valid-parse ng-touched" ng-disabled="" ng-model="address.PostCode" data-hj-ignore-attributes="">


`;




const lookupControlNew = `

<div class="control-group">

    <label class="control-label">Lookup:</label>

    <div class="controls controls-row">

        <div class="input-append">

            <input id="lookupAddressesInputNew" list="lookupAddresses" type="text" autocomplete="off"

                ng-disabled="sameAsShipping || !selectedPostcode" tabindex="-1" ng-model="lookupAddress" ng-change="changeLookupAddress()">

            <datalist id="lookupAddressesNew" class="raised-higher column fill-height scroll-y-auto white">

				<div ng-repeat="item in lookupAddresses" value="{{item.formatted}}">{{item.formatted}}</div>

            </datalist>

        </div>

    </div>

</div>

`;

{ /* <option ng-repeat="item in lookupAddresses" value="{{item.formatted</option>}}"> */ }
const DEBOUNCE_TIME_NEW = 500;

var LookupPlaceHolder = function($scope, $element, $http, $timeout, $compile) {


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


                    // console.log("elem[0].parentElement.parentElement", elem[0].parentElement.parentElement)
                    // elem.empty();

                    // elem.append($compile(postCodeInputNew)(scope));

                    $($compile(postCodeInputNew)(scope)).insertAfter(elem[0].parentElement);
                    $($compile(lookupControlNew)(scope)).insertAfter(elem[0].parentElement);

                    $timeout(function() {

                        scope.$apply(function() {

                            scope.isActivePostCodeInput = false;

                            scope.postcodes = [];

                            scope.lookupAddresses = [];

                            scope.selectedPostcode = undefined;

                            scope.searchPattern = "";
                            scope.selectedTags = [];
                            scope.suggestions = [];
                            scope.tags = ['Mercury', 'Venus', 'Earth', 'Mars', 'Saturn', 'Uranus', 'Neptun', 'Pluto']

                        });

                    });



                    function findAddresses(postalCode) {

                        console.log("findAddresses postalCode:", postalCode)

                        $timeout(function() {
                            console.log("11111111")
                            scope.$apply(function() {
                                console.log("222222222")
                                scope.lookupAddresses = [];
                            });

                        });

                        console.log("http", $http)

                        $http({

                            method: 'GET',

                            url: 'https://postcodelookup.prodashes.com/addresses',

                            params: { postalCode }

                        }).then(function(response) {

                            const data = response.data;

                            console.log("findAddresses data ", data);

                            $timeout(function() {

                                scope.$apply(function() {

                                    scope.lookupAddresses = data.map(x => Object.assign({}, x, { formatted: `${x.address1}, ${x.address2}, ${x.address3}, ${x.town}, ${x.region}, ${x.country}` }));

                                    scope.selectedPostcode = postalCode;

                                    scope.lookupAddress = ""

                                });

                            })

                        });

                    };


                    scope.onSelectPostalCode = function(event, value) {
                        console.log("event", event);
                        console.log("value", value);

                        $timeout(function() {
                            scope.$apply(function() {
                                scope.address.PostCode = value;
                            });

                            const data = scope.postcodes;
                            console.log("data", data);
                            data && console.log('test', data.some(x => x === value))
                            if (data && Array.isArray(data) && data.some(x => x === value)) {
                                findAddresses(value);
                            }
                        })
                    }

                    scope.changePostSearch = function() {

                        console.log("changePostSearch work", scope)
                        debounceTimer && $timeout.cancel(debounceTimer);

                        debounceTimer = $timeout(function() {

                            const postalCode = scope.address.PostCode;

                            const postcodes = scope.postcodes;



                            if (postcodes && postcodes.some(x => x === postalCode)) {

                                findAddresses(postalCode);

                            } else {

                                $timeout(function() {

                                    scope.$apply(function() {

                                        scope.postcodes = [];

                                    });

                                });

                                $http({

                                    method: 'GET',

                                    url: 'https://postcodelookup.prodashes.com/autocomplete',

                                    params: { postalCode }

                                }).then(function(response) {

                                    const data = response.data;

                                    console.log("changePostSearch", data)

                                    $timeout(function() {

                                        scope.$apply(function() {

                                            scope.postcodes = data || [];

                                            scope.selectedPostcode = undefined;

                                        });

                                        // $timeout(function() {
                                        //     console.log("data.some(x => x === postalCode)", data.some(x => x === postalCode))
                                        //     if (data && Array.isArray(data) && data.some(x => x === postalCode)) {

                                        //         findAddresses(postalCode);

                                        //     }

                                        // });

                                    })

                                });

                            }

                        }, DEBOUNCE_TIME_NEW);

                    };

                    scope.onFocusPostcodeInput = function() {
                        console.log("onFocusPostcodeInput")
                        scope.isActivePostCodeInput = true;
                    }


                    scope.onBlurPostcodeInput = function(event) {
                        console.log("onBlurPostcodeInput", event);
                        scope.isActivePostCodeInput = false;
                    }

                    scope.update_current_address = function(a, b, c) {
                        console.log("log a", a);
                        console.log("log b", b);
                        console.log("log c", c);
                    }

                    scope.teeest = function(a, b, c) {
                        console.log("log a", a);
                        console.log("log b", b);
                        console.log("log c", c);
                    }

                    scope.changeLookupAddress = function(e) {

                        const addresses = scope.lookupAddresses;



                        const value = scope.lookupAddress;

                        const address = addresses.find(x => x.formatted === value);

                        if (address) {

                            const country = address.country;

                            const foundCountry = scope.countries.find(c => c.CountryName === country);

                            $timeout(function() {

                                scope.$apply(function() {

                                    scope.address.Address1 = address.address1;

                                    scope.address.Address2 = address.address2;

                                    scope.address.Address3 = address.address3;

                                    scope.address.Town = address.town;

                                    scope.address.Region = address.region;

                                    scope.address.CountryId = foundCountry && foundCountry.CountryId;

                                });

                            });

                        }

                    };
                }
            }
        }
    })

}

Core.PlaceHolderManager.register("OpenOrders_OrderControlButtons", LookupPlaceHolder);