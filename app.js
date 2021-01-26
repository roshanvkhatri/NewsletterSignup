const bodyParser = require("body-parser");
const express = require("express");
const request = require("request");
const https = require("https");
const mailchimp = require('@mailchimp/mailchimp_marketing');

const port = process.env.PORT || 3000
const app = express();

mailchimp.setConfig({
    apiKey: 'd2f6c72949b2bebea294bc05bf07f3f7-us7',
    server: 'us7',
  });


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html")
});

app.post("/", function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const inputEmail = req.body.inputEmail;

    const data = {
        members: [
            {
                email_address: inputEmail,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us7.api.mailchimp.com/3.0/lists/2c173eaadc";

    const options = {
        method: "POST",
        auth: "user:d2f6c72949b2bebea294bc05bf07f3f7-us7"
    }

    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data", function (data) {
            const responseData =  JSON.parse(data);
            console.log(responseData);
        })
    });
    request.write(jsonData);
    request.end();
})

app.post("/failure", function (req, res) {
    res.redirect("/")
});

app.listen(port, function () {
    console.log("server running at port"+port);
})


// App Key : 
// d2f6c72949b2bebea294bc05bf07f3f7-us7

// Audience ID : 
// 2c173eaadc