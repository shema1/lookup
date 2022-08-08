"use strict";
// let postCodeInputNew = `
// <div ng-class="{'translucent margin-none margin-top': $ctrl.isLocked}">
//                     <!----><h6 ng-if="!$ctrl.isLocked">
//                         Postcode
//                     </h6><!---->
//                     <!---->
//                 </div>
// <input ng-blur="onBlurPostcodeInput($event)" ng-focus="onFocusPostcodeInput()" lw-tst="input_postalCode" list="postcodes" type="text" autocomplete="off" class='disabled-transparent ng-pristine ng-valid ng-empty ng-touched' ng-disabled="sameAsShipping" tabindex="8" ng-model="address.PostCode" ng-change="changePostSearch()">

// <!----><button ng-if="!isBillingAddres" lw-tst="lookUp_postalCode" type="button" ng-click="lookUp($event,'POSTALCODE', address.PostCode);" class="btn"><i class="fa fa-search"></i></button><!---->

// <datalist ng-if='isActivePostCodeInput' id="postcodesNew" class="raised-higher column fill-height scroll-y-auto white">
//     <div ng-repeat="item in postcodes" value="{{item}}" ng-click="onSelectPostalCode($event, item)">{{item}}</div>
// </datalist>

// `;


let postCodeInputNew = `
 <div ng-class="{'translucent margin-none margin-top': $ctrl.isLocked}">
                     <!----><h6 ng-if="!$ctrl.isLocked">
                         Postcode
                     </h6><!---->
                     <!---->
                 </div>

<input focus-out="testX()" lw-tst="input_postalCode" list="postcodes" type="text" autocomplete="off" ng-disabled="sameAsShipping" tabindex="8" ng-model="address.PostCode" ng-change="changePostSearch()">

<!----><button ng-if="!isBillingAddres" lw-tst="lookUp_postalCode" type="button" ng-click="lookUp($event,'POSTALCODE', address.PostCode);" class="btn"><i class="fa fa-search"></i></button><!---->

<datalist id="postcodes">

	<option ng-repeat="item in postcodes" value="{{item}}">

</datalist>
<div>
            <label>Search: </label>
            <input type="text" ng-model="searchPattern"/>
            <autocomplete values="tags" search="searchPattern" suggestions="suggestions" selected="selectedTags" ></autocomplete>
        </div>
        <ul>
        <li ng-repeat="suggestion in suggestions">
           {{suggestion}}
           &nbsp;
           <b ng-click="addToSelectedTags($index)"><i>add</i></b>
         </li>
      </ul>

      <div angucomplete-altid="txtCountries" placeholder="Country" pause="100" selected-object="Search"
        focus-out="Validate()" local-data="Countries" search-fields="Country" title-field="Country"
        minlength="1" input-class="form-control" match-class="highlight">
    </div>

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

                                        $timeout(function() {
                                            console.log("data.some(x => x === postalCode)", data.some(x => x === postalCode))
                                            if (data && Array.isArray(data) && data.some(x => x === postalCode)) {

                                                findAddresses(postalCode);

                                            }

                                        });

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

                    scope.search = function() {
                        scope.suggestions = scope.tags.filter(function(value) {
                            console.log('woork1', value)
                            return value.indexOf(scope.searchPattern) !== -1;
                        });
                    }

                    /* Executes a new search when the pattern has changed */
                    scope.$watch('searchPattern', function(newValue, oldValue) {
                        console.log("woork2", newValue, oldValue)
                        scope.searchPattern = newValue;
                        scope.search();
                    });

                    scope.addToSelectedTags = function(index) {
                        console.log("index", index);
                        if ($scope.selectedTags.indexOf($scope.suggestions[index]) === -1) {
                            $scope.selectedTags.push($scope.suggestions[index]);
                            $scope.searchPattern = "";
                        }
                    }

                    scope.testX = function() {
                        console.log("testX work");
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

Core.PlaceHolderManager.register("OrderAddress_ShippingFields", LookupPlaceHolder);