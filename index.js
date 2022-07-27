"use strict";


var PlaceHolder = function ($scope, $element, $http, $timeout, $compile) {


    this.getItems = function () {
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
        }
        else if (element.children != null) {
            var i;
            var result = null;
            for (i = 0; result == null && i < element.children.length; i++) {
                result = getPostCode(element.children[i], matchingTitle);
            }
            return result;
        }
        return null;
    }

    viewModule.directive("div", function () {
        return {
            link: function (scope, elem, attrs) {
                // console.log("elem", elem)

                const postCode = getPostCode(elem[0], "ssss")
                if (postCode) {
                    console.log("postCode", postCode)
                }

                if (postCode) {
                    console.log("elem", elem)
                    elem.empty();

                    elem.append($compile(postCodeInput)(scope));



                    $($compile(lookupControl)(scope)).insertAfter(elem[0].parentElement.parentElement);



                    $timeout(function () {

                        scope.$apply(function () {

                            scope.postcodes = [];

                            scope.lookupAddresses = [];

                            scope.selectedPostcode = undefined;

                        });

                    });



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

                                    scope.lookupAddress = ""

                                });

                            })

                        });

                    };



                    scope.changePostSearch = function () {

                        debounceTimer && $timeout.cancel(debounceTimer);

                        debounceTimer = $timeout(function () {

                            const postalCode = scope.address.PostCode;

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

                                                findAddresses(postalCode);

                                            }

                                        });

                                    })

                                });

                            }

                        }, DEBOUNCE_TIME);

                    };



                    scope.changeLookupAddress = function (e) {

                        const addresses = scope.lookupAddresses;



                        const value = scope.lookupAddress;

                        const address = addresses.find(x => x.formatted === value);

                        if (address) {

                            const country = address.country;

                            const foundCountry = scope.countries.find(c => c.CountryName === country);

                            $timeout(function () {

                                scope.$apply(function () {

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

Core.PlaceHolderManager.register("OpenOrders_OrderControlButtons", PlaceHolder);

