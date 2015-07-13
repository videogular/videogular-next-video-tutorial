"use strict";
angular.module("com.2fdevs.videogular.plugins.next-video", ["angular-svg-round-progress"])
    .run(["$templateCache",
        function ($templateCache) {
            $templateCache.put("vg-templates/vg-next-video",
                '<div class="loader-container" ng-if="ctrl.isCompleted">' +
                    '<div round-progress max="ctrl.max" current="ctrl.current" color="#eeeeee" bgcolor="#333333" radius="50" stroke="10"></div>' +
                    '<div class="cancel" ng-click="ctrl.cancelTimer()">cancel</div>' +
                '</div>'
            );
        }
    ])
    .directive("vgNextVideo",
    [function () {
        return {
            restrict: "E",
            require: "^videogular",
            templateUrl: function (elem, attrs) {
                return attrs.vgTemplate || 'vg-templates/vg-next-video';
            },
            scope: {
                vgSrc: "=",
                vgTime: "=?"
            },
            controllerAs: "ctrl",
            controller: ["$scope", "$timeout", "vgNextVideoService",
                function($scope, $timeout, vgNextVideoService) {
                    this.max = $scope.vgTime || 5000;
                    this.current = 0;
                    this.timer = null;
                    this.isCompleted = false;
                    this.currentVideo = 0;
                    this.sources = null;

                    this.onLoadData = function(sources) {
                        this.sources = sources;
                        $scope.API.sources = this.sources[this.currentVideo];
                    };

                    this.onLoadDataError = function() {
                        $scope.API.onVideoError();
                    };

                    this.count = function() {
                        this.current += 10;

                        if (this.current >= this.max) {
                            $timeout.cancel(this.timer);

                            $scope.API.autoPlay = true;

                            this.current = 0;
                            this.isCompleted = false;
                            $scope.API.isCompleted = false;

                            this.currentVideo++;

                            if (this.currentVideo === this.sources.length) this.currentVideo = 0;

                            $scope.API.sources = this.sources[this.currentVideo];
                        }
                        else {
                            this.timer = $timeout(this.count.bind(this), 10);
                        }
                    };

                    this.cancelTimer = function() {
                        $timeout.cancel(this.timer);
                        this.current = 0;
                        this.isCompleted = false;
                    };

                    this.onComplete = function(newVal) {
                        this.isCompleted = newVal;

                        if (newVal) {
                            this.timer = $timeout(this.count.bind(this), 10);
                        }
                    };

                    $scope.$watch(
                        function() {
                            return $scope.API.isCompleted;
                        },
                        this.onComplete.bind(this)
                    );

                    vgNextVideoService.loadData($scope.vgSrc).then(
                        this.onLoadData.bind(this),
                        this.onLoadDataError.bind(this)
                    );
                }
            ],
            link: function (scope, elem, attr, API) {
                scope.API = API;
            }
        }
    }]
);
