// KLARNA:

//     SESSION
let promiseKlarna = new Promise((resolve, reject) => {
    let client_token
    $.post("/klarnaSession/", {},
        function (data, status) {
            client_token = data.client_token
            console.log("\nClient Token:\n" + client_token);
            if (client_token)
                resolve(client_token)
        })
}).then((client_token) => {
    window.klarnaAsyncCallback(client_token)
});

window.klarnaAsyncCallback = function (client_token) {
    // INIT
    try {
        Klarna.Payments.init({
            client_token: client_token
        });
    } catch (e) {
        console.log("Init:" + e)
    }



    //LOAD
    try {
        console.log("\nKlarna load...\n");
        Klarna.Payments.load({
            container: '#klarna_container',
            payment_method_category: 'pay_over_time',
            instance_id: "klarna-payments-instance"
        }, function (res) {

            console.log("\nKlarna loaded\n");
            console.debug(res);
        })
    } catch (e) {
        console.log("Load:\n" + e)
    }
};

// AUTHORISE
let klarnaAuth = function () {
    console.log("Klarna: Authorization")
    try {
        Klarna.Payments.authorize(
            // options
            {
                instance_id: "klarna-payments-instance"
            }, {
            purchase_country: "US",
            purchase_currency: "USD",
            locale: "en-US",
            billing_address: {
                given_name: "John",
                family_name: "Doe",
                email: "john@doe.com",
                title: "Mr",
                street_address: "Lombard St 10",
                street_address2: "Apt 214",
                postal_code: "90210",
                city: "Beverly Hills",
                region: "CA",
                phone: "3106143376",
                country: "US"
            },
            shipping_address: {
                given_name: "John",
                family_name: "Doe",
                email: "john@doe.com",
                title: "Mr",
                street_address: "Lombard St 10",
                street_address2: "Apt 214",
                postal_code: "90210",
                city: "Beverly Hills",
                region: "CA",
                phone: "3106143376",
                country: "US"
            },
            // order_amount: 1,
            order_tax_amount: 0,
            order_lines: [
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
            ],
            customer: {
                date_of_birth: "1970-01-01",
            },
        },
            function (response) {
                console.log("Authorise Success:\n")
                console.log(response)
                console.log("Response token: " + response.authorization_token)


                //PLACE ORDER
                $.post("/placeOrder/", {
                    authorization_token: response.authorization_token
                },
                    function (data, status) {
                        console.log("Order Placed\n");
                        console.log(data);
                    });
            }
        );
    } catch (e) {
        console.log("Authorise:\n" + e)
    }
}
///// End of Klarna setup
