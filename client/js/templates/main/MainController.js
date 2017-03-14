(function() {


    var MainController = function($rootScope, $scope, $http) {

        $scope.processedArray = new Array();
        

        $scope.calculateResult = function() {

            var array;
            var f = document.getElementById('file').files[0];

            if ($scope.radioSelected == "file" && f) {

                var r = new FileReader();
                r.readAsText(f);
                r.onload = function() {

                    var contents = r.result;
                    //alert(contents);
                    array = createArrayOfItemIds(contents, 'file');
                    processFile(array);

                };

            } else if ($scope.radioSelected == "manual" && $scope.itemIds && $scope.itemIds.trim() != "") {

                array = createArrayOfItemIds($scope.itemIds, 'inputbox');
                processFile(array);

            } else {
                alert("Please select radio button and enter value for it");
                return;
            }

        }

        var createArrayOfItemIds = function(data, source) {

            var array;
            if (source == 'file')
                array = data.split("\n");
            else
                array = data.split(",");

            return array;
        }

        var processFile = function(dataArr) {

            $http({
                method: 'POST',
                url: '/itemStatus',
                data: dataArr
            }).
            then(function(response) {

                $scope.processedArray = response.data;
              //  $scope.gridOptions.data = $scope.processedArray ;
                console.log('processedArray-' + JSON.stringify($scope.processedArray));
            }, function(error) {
                alert("Server error!!");
              });
        };


        $scope.getCompleteResponse = function() {

            $http.get('/service1/' + $scope.itemId).
            then(function(response) {

                var win = window.open("", "Title", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=1200, height=800, top=100, left=100");
                win.document.title = "SERVICE1 Response";
                win.document.body.innerHTML = "<div id='element' style='background-color:#f4f0f0;'></div>";

                $(win.document.getElementById("element")).jsonView(JSON.stringify(response.data));


            }, function(error) {
                alert("Server error!!");
              });
        }

        $scope.downloadFile = function() {

            var data, filename, link;

            var csv = convertArrayOfObjectsToCSV($scope.processedArray);

            if (csv == null)
                return;

            filename = 'export.csv';

            if (!csv.match(/^data:text\/csv/i)) {
                csv = 'data:text/csv;charset=utf-8,' + csv;
            }
            data = encodeURI(csv);

            link = document.createElement('a');
            link.setAttribute('href', data);
            link.setAttribute('download', filename);
            link.click();
            console.log('Processing Done');

        }

        var convertArrayOfObjectsToCSV = function(data) {

            var result, ctr, keys, columnDelimiter, lineDelimiter;


            if (data == null || !data.length) {
                return null;
            }

            columnDelimiter = ',';
            lineDelimiter = '\n';

            keys = Object.keys(data[0]);

            // Delete $$hashKey which is inserted by Angular.
            keys.pop();

            result = '';
            result += keys.join(columnDelimiter);
            result += lineDelimiter;

            data.forEach(function(item) {
                ctr = 0;
                keys.forEach(function(key) {
                    if (ctr > 0)
                        result += columnDelimiter;

                    result += item[key];
                    ctr++;
                });
                result += lineDelimiter;
            });

            return result;
        }

    };

    var app = angular.module("itemCheckerModule");
    app.controller("MainController", MainController);


}());
