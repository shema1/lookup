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
                result = searchTree(element.children[i], matchingTitle);
            }
            return result;
        }
        return null;
    }

    viewModule.directive("div", function () {
        return {
            link: function (scope, elem, attrs) {
                console.log("elem", elem)

                const postCode = getPostCode(elem[0])
                if(postCode){
                    console.log("postCode", postCode)
                }
            }
        }
    })

}

Core.PlaceHolderManager.register("OpenOrders_OrderControlButtons", PlaceHolder);

