app.controller('marvelController', ['$scope', '$http', '$timeout', 'sessionService', function ($scope, $http, $timeout, sessionService) {

    //search modal
    $scope.searchModal = function () {
        $('#search-modal').modal('show');
    }
    $scope.bookmark = false;
    //params for service
    $scope.marvelfilter = {
        nameStartsWith: null,
        limit: 12,
        offset: 0,
        ts: 1,
        apikey: '39579f1cdfa1134cf33d669bb5176e39',
        hash: 'c4d6f0fac656003bf2f2081b2a8fcc3e'
    }

    $('.loader').hide();
    $scope.errormsg = false;
    //get all heroes
    $scope.getHeroes = function (pagination) {
        $scope.marvelfilter.offset = ($scope.currentPage - 1) * 12;
        $('.loader').show();
        var myStorageHeroes = [];
        myStorageHeroes = JSON.parse(sessionService.get('myheroes'));
        if ($scope.marvelfilter.nameStartsWith == "") {
            $scope.marvelfilter.nameStartsWith = null
        };
        var request = {
            method: 'GET',
            url: "https://gateway.marvel.com/v1/public/characters",
            params: $scope.marvelfilter
        }
        $http(request).then(function (response) {
            if (pagination == true) {
                $scope.bookmark = true;
                $scope.heroes = response.data.data;
            } else {
                if ($scope.marvelfilter.nameStartsWith || myStorageHeroes == null || myStorageHeroes.length == 0) {
                    $scope.bookmark = true;
                    $scope.heroes = response.data.data;
                }
                else {
                    $scope.bookmark = false;
                    $scope.heroes = { results: [] };
                    $scope.heroes.results = myStorageHeroes;
                    $scope.heroes.total = myStorageHeroes.length
                }
            }
            $('.loader').hide();
        }, function (response) {
            alert(response.data.message);
        })
    }
    $scope.getHeroes(false);

    // change user icon with list icon (top right)
    $scope.toggleHeroList = function (bookmark) {
        if ($scope.selected.length == 0) {
            $scope.errormsg = true
            $timeout(function () { $scope.errormsg = false }, 3000);
        }
      
        if (bookmark == false) {
            $scope.marvelfilter.nameStartsWith = null
        }
        $scope.getHeroes(bookmark);
    }

    $scope.selected = [];
    $scope.toggle = function (item, list) {
        if (sessionService.get('myheroes') == null) {
            list = list;
        } else {
            list = JSON.parse(sessionService.get('myheroes'));
        }
        var idx = list.indexOf(item);
        if (idx > -1) {
            list.splice(idx, 1);
        }
        else {
            list.push(item);
        }
        sessionService.set('myheroes', JSON.stringify(list))
        $scope.selected = JSON.parse(sessionService.get('myheroes'))
    };

    //remove hero from storage array list
    $scope.unCheckHero = function (hero) {
        var array = JSON.parse(sessionService.get('myheroes'))
        for (var i = 0; i < array.length; i++) {
            if (array[i].id == hero.id) {
                array.splice(i, 1);
                $scope.selected = array;
                sessionService.set('myheroes', JSON.stringify(array))
                $scope.getHeroes($scope.bookmark);
            }
        }
    }
    //check if id exist
    $scope.existID = function (id) {
        var array = JSON.parse(sessionService.get('myheroes'))
        if (array !== null) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].id == id) {
                    return true;
                }
            }
        }
    }
    //pagination
    $scope.currentPage = 1;
    $scope.maxSize = 3;
}])
