angular.module("com.2fdevs.videogular.plugins.next-video")
    .service("vgNextVideoService", ["$http", "$q", "$sce",
        function($http, $q, $sce) {
            var deferred = $q.defer();

            this.loadData = function(url) {
                $http.get(url).then(
                    this.onLoadData.bind(this),
                    this.onLoadError.bind(this)
                );

                return deferred.promise;
            };

            this.onLoadData = function(response) {
                var result = [];


                for (var i=0, l=response.data.length; i<l; i++) {
                    var mediaSources = [];

                    for (var mi=0, ml=response.data[i].length; mi<ml; mi++) {
                        var mediaFile = {
                            src: $sce.trustAsResourceUrl(response.data[i][mi].src), type: response.data[i][mi].type
                        };

                        mediaSources.push(mediaFile);
                    }

                    result.push(mediaSources);
                }

                deferred.resolve(result);
            };

            this.onLoadError = function(error) {
                deferred.reject(error);
            };
        }
    ]);
