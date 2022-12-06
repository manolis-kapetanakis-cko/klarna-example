const axios = require('axios');
const path = require('path');




var appRouter = function (app) {
    app.get("/", function (req, res) {
        res.sendFile(path.join(__dirname, '../index.html'));
    });

    // KLARNA
    app.post("/klarnaSession/", async (req, res) => {
        console.log("Initialising Klarna Session");
        let payment;
        try {
            payment = await axios.post("https://api-na.playground.klarna.com/payments/v1/sessions", {
                "locale": "en-US",
                "purchase_country": "US",
                "purchase_currency": "USD",
                "merchant_reference1": "Klarna_customerorderID",
                "order_amount": 18000,
                "order_tax_amount": 2000,
                "order_lines": [
                    {
                        "reference": "KLN-100",
                        "quantity": 1,
                        "unit_price": 8000,
                        "image_url": "https://www.klarna.com/example/image/prod.jpg",
                        "total_amount": 8000,
                        "type": "physical",
                        "product_url": "https://www.klarna.com/example/widget1=prod",
                        "name": "Klarna Widget 1"
                    },
                    {
                        "reference": "KLN-101",
                        "quantity": 1,
                        "unit_price": 8000,
                        "image_url": "https://www.klarna.com/example/image/prod.jpg",
                        "total_amount": 8000,
                        "type": "physical",
                        "product_url": "https://www.klarna.com/example/widget2=prod",
                        "name": "Klarna Widget 2"
                    },
                    {
                        "quantity": 1,
                        "total_amount": 2000,
                        "type": "sales_tax",
                        "name": "Tax",
                        "unit_price": 2000
                    }
                ]
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Basic TjEwNDcwMV9mNzIwNzIxZDdkNjY6dUVXd0syWml1MnBaS2RrMQ=="
                }
            })
            console.log(payment.data)
            res.status(200).send(payment.data);
        }
        catch (err) {
            res.status(500).send(err.response);
        }
    });

    app.post("/placeOrder/", async (req, res) => {
        let authorization_token = req.body.authorization_token;
        console.log("Placing Order: " + authorization_token);

        let order;
        try {
            order = await axios.post('https://api-na.playground.klarna.com/payments/v1/authorizations/' + authorization_token + '/order', {
                "purchase_country": "US",
                "purchase_currency": "USD",
                "order_amount": 18000,
                "billing_address": {
                    "given_name": "John",
                    "family_name": "Doe",
                    "email": "john@doe.com",
                    "title": "Mr",
                    "street_address": "Lombard St 10",
                    "street_address2": "Apt 214",
                    "postal_code": "90210",
                    "city": "Beverly Hills",
                    "region": "CA",
                    "phone": "333444555",
                    "country": "US"
                },
                "shipping_address": {
                    "given_name": "John",
                    "family_name": "Doe",
                    "email": "john@doe.com",
                    "title": "Mr",
                    "street_address": "Lombard St 10",
                    "street_address2": "Apt 214",
                    "postal_code": "90210",
                    "city": "Beverly Hills",
                    "region": "CA",
                    "phone": "333444555",
                    "country": "US"
                },
                "order_lines": [
                    {
                        "reference": "KLN-100",
                        "quantity": 1,
                        "unit_price": 8000,
                        "image_url": "https://www.klarna.com/example/image/prod.jpg",
                        "total_amount": 8000,
                        "type": "physical",
                        "product_url": "https://www.klarna.com/example/widget1=prod",
                        "name": "Klarna Widget 1"
                    },
                    {
                        "reference": "KLN-101",
                        "quantity": 1,
                        "unit_price": 8000,
                        "image_url": "https://www.klarna.com/example/image/prod.jpg",
                        "total_amount": 8000,
                        "type": "physical",
                        "product_url": "https://www.klarna.com/example/widget2=prod",
                        "name": "Klarna Widget 2"
                    },
                    {
                        "quantity": 1,
                        "total_amount": 2000,
                        "type": "sales_tax",
                        "name": "Tax",
                        "unit_price": 2000
                    }
                ]
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic TjEwNDcwMV9mNzIwNzIxZDdkNjY6dUVXd0syWml1MnBaS2RrMQ=='
                }
            })
            console.log(order.data)
            res.status(200).send(order.data);
        }
        catch (err) {
            res.status(500).send(err.response);
        }
    });
}

module.exports = appRouter;
