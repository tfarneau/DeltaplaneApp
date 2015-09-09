angular.module('App', ['ui.router','ngStorage','perfect_scrollbar','ngResource','ngAnimate'])

.constant('config', {
    API_URL: 'http://deltaplane/api/api',
    BASE_URL: 'http://deltaplane'
})

/*.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
}])*/

.config(['$stateProvider', '$urlRouterProvider','$httpProvider',
    function($stateProvider, $urlRouterProvider, $httpProvider) {

        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        $urlRouterProvider.otherwise('/');

        $stateProvider

            .state('login', {
                url: '/',
                templateUrl: 'components/login.html'
            })

            .state('projects', {
                url: '/projects',
                templateUrl: 'components/projects.html'
            })

            .state('calendar', {
                url: '/projects/{projectId:[0-9]{1,8}}/calendar',
                templateUrl: 'components/calendar.html'
            })

            .state('mainCalendar', {
                url: '/calendar',
                templateUrl: 'components/calendar.html'
            })

            .state('project', {
                url: '/projects/{projectId:[0-9]{1,8}}',
                templateUrl: 'components/project.html'
            });

        $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
           return {
               'request': function (config) {
                   config.headers = config.headers || {};
                   if ($localStorage.token) {
                       config.headers.Authorization = 'Bearer ' + $localStorage.token;
                   }

                   config.headers['Accept'] = "application/json";
                   config.headers['Content-Type'] = "application/json";

                   return config;
               },
               'responseError': function (response) {
                   /*if (response.status === 401 || response.status === 403) {
                        console.log("not auth")
                       // $location.path('/login');
                   }*/
                   return $q.reject(response);
               }
           };
        }]);

    }
]);