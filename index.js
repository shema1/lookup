const value = 'test'
let postCodeInput = `

<input lw-tst="input_postalCode" list="postcodes" type="text" autocomplete="off" ng-disabled="sameAsShipping" tabindex="8" ng-model="address.PostCode" ng-change="changePostSearch()">

<!----><button ng-if="!isBillingAddres" lw-tst="lookUp_postalCode" type="button" ng-click="lookUp($event,'POSTALCODE', address.PostCode);" class="btn"><i class="fa fa-search"></i></button><!---->

<datalist id="postcodes">

	<option ng-repeat="item in postcodes" value="{{item}}">

</datalist>

`;



const lookupControl = `

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



const DEBOUNCE_TIME = 500;



var PlaceHolder = function ($scope, $element, $http, $timeout, $compile) {


	this.getItems = function () {
		//this is for fuzz, because he forgot to let me know that function should return empty array
		return [];
        	//specially for fuzz and nik :)
        }


	let debounceTimer = null;



	const viewModule = angular.module("openOrdersViewService");



	viewModule.directive("div", function () {

		return {

			link: function (scope, elem, attrs) {
				if (elem && elem[0] && elem[0].children[0] && elem[0].children[0].getAttribute("lw-tst") === "input_postalCode") {

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

	});

}



Core.PlaceHolderManager.register("OpenOrder_EditOrder_OrderControlButtons", PlaceHolder);