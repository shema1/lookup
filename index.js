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



var PlaceHolder = function ($scope, $element, $http, $timeout, $compile) {

  console.log("wooork");

  this.getItems = function () {
    //this is for fuzz, because he forgot to let me know that function should return empty array
    return [];
    //specially for fuzz and nik :)
  }

  let debounceTimer = null;



  const viewModule = angular.module("openOrdersViewService");
  console.log("viewModule", viewModule)

  const testA = angular.module("NewopenOrdersViewService");
  console.log("testA", testA);

  const testB = angular.module("NewOpenOrdersViewService");
  console.log("testB", testB);

  const testC = angular.module("ssss");
  console.log("testC", testC);

  viewModule.directive("div", function () {

    return {

      link: function (scope, elem, attrs) {
        console.log("elem", elem);
        const test1 = elem[0]?.children[1]?.children[0]?.children[0]?.children[12];

        if (test1) {
          console.log("test1", test1)
          console.log("test2", test1.children)
          console.log("test3", test1.children[0])
          console.log("test4", test1.children[1])
          console.log("test5", test1.firstChild)
          console.log("test6", test1.firstChild.ownerDocument.getElementById)
          console.log("test7", test1.firstChild.ownerDocument.querySelectorAll)
          const a = test1.firstChild.ownerDocument.querySelectorAll('[address-auto-complete-field="POSTALCODE"]')
          console.log("test8", a)
          console.log("test9", a.append)






        }
        // console.log("elem[0].children[1].children[0].children[0]", elem[0].children[1].children[0].children[0]);

        if (elem && elem[0] && elem[0].children[0] && elem[0].children[0].getAttribute("lw-tst") === "input_postalCode") {

          elem.empty();

          elem.append($compile(postCodeInputNew)(scope));



          $($compile(lookupControlNew)(scope)).insertAfter(elem[0].parentElement.parentElement);



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

            }, DEBOUNCE_TIME_NEW);

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