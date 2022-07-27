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


    viewModule.directive("div", function () {
        return {
            link: function (scope, elem, attrs) {
                console.log("elem", elem)
            }
        }
    })

}

Core.PlaceHolderManager.register("OpenOrders_OrderControlButtons", PlaceHolder);

