var app = angular.module('marvel', ['ui.bootstrap', 'chieffancypants.loadingBar']);

app.run(function ($rootScope) {
    $rootScope.loadingflag = false;
    $rootScope.$on('cfpLoadingBar:completed', function () {
        $rootScope.loadingflag = true;
    });
})
