var express = require("express"); // Initialisation of Express.js module for Node.js REST Calling
var app = express(); // Express variable
app.use(express.static(__dirname + '/client'));
var util = require('util');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
//     extended: true
// }));



var async_request = require('request');
var request = require('sync-request');
var outputArr;

// Routers ---


// **************************************************************** 1. Get SERVICE1 response **********************************************************


app.get('/service1/:item_d', function(req, res) {

    var item_id = req.params.item_d;
    console.log(util.inspect(item_id));

    var service1Url = 'this.is.request.url';

    var _service1Res = request('POST', service1Url, {
        body: '{body will go here}',
        headers: { //We can define headers here

            'HEADER_KEY':'HEADER_VALUE'
        }
    });

    res.send(JSON.parse(_service1Res.getBody()));

});




// **************************************************************** 2. Get Item Page and SERVICE1 status **********************************************************



app.post('/itemStatus', function(req, res) {

    var inputArr = req.body;

    getItemPageAndSERVICE1Details(inputArr, res);

});


function getItemPageAndSERVICE1Details(inputArr, res) {

    outputArr = new Array();

    for (var i = 0, len = inputArr.length; i < len; i++) {

        itemPageAndSERVICE1RESTCall(inputArr[i], len, res);
    }
}


function itemPageAndSERVICE1RESTCall(itemId, len, res){

    var itemPageStatus = '';
    var service1Status = '';

    async_request("http://page.url.will.go.here.com" + itemId, function (error, response, body) {

        if(response){
            itemPageStatus = response.statusCode;
        }

        //Get SERVICE1 Response by making SERVICE1 REST call

        async_request({
            url : 'this.is.request.url',
            method: 'POST',
            body: '{body will go here}',

            headers: { //We can define headers here

                'HEADER_KEY':'HEADER_VALUE'
            }


        }, function (error, response, body){

            var service1ResObject = JSON.parse(body);

            if (service1ResObject.payload[0] && service1ResObject.payload[0].entityErrors[0]) {
                service1Status = service1ResObject.payload[0].entityErrors[0].code;
            }

            console.log('item id in output: ' + util.inspect(itemId));

            outputArr.push({
                ItemId: itemId,
                StatusCode: itemPageStatus,
                SERVICE1Error: service1Status
            });


            if(outputArr.length==len) {
                res.send(outputArr);
            }

        });

    });

}

// **************************************************************** 3. Get Customer details **********************************************************


app.post('/ca', function(req, res) {

    var inputArr = req.body;

    getCustomerDetails(inputArr,res);

});

function getCustomerDetails(inputArr,res) {

    outputArr = new Array();


    for (var i = 0, len = inputArr.length; i < len; i++) {

        caRESTCall(inputArr[i],len,res);
    }


}

function caRESTCall(customerId,len,res){

    var firstName='';
    var lastName='';
    var emailId='';

    async_request({
        url: 'this.is.request.url' + customerId,
        method: 'GET',

        headers: { //We can define headers here

            'HEADER_KEY':'HEADER_VALUE'
        }


    }, function (error, response, body){


        switch (response.statusCode) {

            case 200:

                var _caResObject = JSON.parse(body);

                console.log('synch ca response status: ' + util.inspect(_caResObject));


                if (_caResObject.payload && _caResObject.payload.person && _caResObject.payload.person.names && _caResObject.payload.person.names[0] && _caResObject.payload.person.names[0].personName) {
                    firstName = _caResObject.payload.person.names[0].personName.firstName;
                    lastName = _caResObject.payload.person.names[0].personName.lastName;
                    if (_caResObject.payload && _caResObject.payload.person && _caResObject.payload.person.accounts && _caResObject.payload.person.accounts[0]) {
                        emailId = _caResObject.payload.person.accounts[0].emailAddress;
                    }
                }

                break;

            default:

                firstName = 'Person does not exist';
                lastName = '';
                emailId = '';
        }

        outputArr.push({
            customerId: customerId,
            fName: firstName,
            lName: lastName,
            emailId: emailId
        });

        if(outputArr.length==len) {
            res.send(outputArr);
        }

    });

}




// **************************************************************** 3. Get Customer address by email id **********************************************************


app.post('/caaddress', function(req, res) {


    console.log('Inside CA Address');


    var inputArr = req.body;

    getCustomerAddress(inputArr,res);

});

function getCustomerAddress(inputArr,res) {

    outputArr = new Array();


    for (var i = 0, len = inputArr.length; i < len; i++) {

        // console.log('CA email to process: ' + inputArr[i]);
        caRESTCallForAddress(inputArr[i],len,res);
    }


}

function caRESTCallForAddress(customerId,len,res){

    var firstName='';
    var lastName='';
    var emailId= customerId;
    var address='';

    async_request({
        url: 'this.is.request.url' + customerId,
        method: 'GET',

        headers: { //We can define headers here

            'HEADER_KEY':'HEADER_VALUE'
        }


    }, function (error, response, body){


        switch (response.statusCode) {

            case 200:

                var _caResObject = JSON.parse(body);

                // console.log('synch ca response status: ' + util.inspect(_caResObject));


                if (_caResObject.payload && _caResObject.payload.persons && _caResObject.payload.persons[0] && _caResObject.payload.persons[0].accounts
                     && _caResObject.payload.persons[0].accounts[0] && _caResObject.payload.persons[0].accounts[0].deliveryPreferences &&
                    _caResObject.payload.persons[0].accounts[0].deliveryPreferences.length>0 ){

                    var deliveryPreferences = _caResObject.payload.persons[0].accounts[0].deliveryPreferences;

                    for (var i=0;i<deliveryPreferences.length;i++){

                        if(deliveryPreferences[i].defaultPreference){
                             // emailId = customerId;
                            address = JSON.stringify(deliveryPreferences[i].contactInformation.postalAddress);
                            address = address.slice(1, address.length-1);

                        }

                    }


                }

                break;

            default:

                // firstName = 'Person does not exist';
                // lastName = '';
                emailId = '';
                address = '';
        }

        outputArr.push({
            // customerId: customerId,
            // fName: firstName,
            // lName: lastName,
            emailId: emailId,
            address: address
        });

        if(outputArr.length==len) {
            res.send(outputArr);
        }

    });

}



// **************************************************************** 4. Get Bundle details **********************************************************


app.post('/bundle', function(req, res) {

    var inputArr = req.body;
    console.log('input array: ' + util.inspect(inputArr));

   // outputArr = getBundleDetails(inputArr);

    getBundleDetails(inputArr,res);


    //console.log('final output array for sending to client: ' + util.inspect(outputArr));
    //res.send(outputArr);


});

function getBundleDetails(inputArr,res) {

    outputArr = new Array();


    for (var i = 0, len = inputArr.length; i < len; i++) {

        cbValidatorRESTCall(inputArr[i],len,res);
    }


}


function cbValidatorRESTCall(bundleId,len,res){

    var canAddToCart = '';
    var bundleType = '';
    var status = '';

    async_request({
        url: 'this.is.request.url',
        method: 'POST',
        headers: { //We can define headers here

            'HEADER_KEY':'HEADER_VALUE'
        },

        body: '{body will go here}'

    }, function (error, response, body){


        var bundleResObject;

        if(body){

            bundleResObject = JSON.parse(body);

            if(bundleResObject && bundleResObject.payload){

                bundleType = bundleResObject.payload.type;
            }
            else{
                bundleType = "--";
            }

            if (bundleResObject.payload && bundleResObject.payload.offerValidationResponse &&
                bundleResObject.payload.offerValidationResponse.payload &&
                bundleResObject.payload.offerValidationResponse.payload.groupOffers &&
                bundleResObject.payload.offerValidationResponse.payload.groupOffers[0] &&
                bundleResObject.payload.offerValidationResponse.payload.groupOffers[0].storeFronts &&
                bundleResObject.payload.offerValidationResponse.payload.groupOffers[0].storeFronts[0] &&
                bundleResObject.payload.offerValidationResponse.payload.groupOffers[0].storeFronts[0].canAddToCart != null) {



                canAddToCart = bundleResObject.payload.offerValidationResponse.payload.groupOffers[0].storeFronts[0].canAddToCart;

            }
            else{

                canAddToCart = false;
            }

            if(bundleResObject){
                status =  bundleResObject.status;
            }
            else{
                status = "--";
            }

        }


        console.log('bundle id in output: ' + util.inspect(bundleId));

        outputArr.push({
            bundleId: bundleId,
            bundleType: bundleType,
            canAddToCart: canAddToCart,
            status: status
        });

        if(outputArr.length==len) {
            res.send(outputArr);
        }

    });

}




// **************************************************************** Load index.html file **********************************************************


app.get('/', function(req, res) {
    res.sendFile('./client/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});


// **************************************************************** Start server **********************************************************


app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});
