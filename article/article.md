# How to Build a Single-Page Sales Funnel App using Node.js, Cosmic JS and Stripe

<img src="../public/images/smartmockups_main.jpg" style="display: block; margin-left: auto; margin-right: auto;"/>

What is a sales funnel? And why is it important? A sales funnel is a path that your website's visitors take before purchasing a product. If you don’t understand your sales funnel, you can’t optimize it. Building a great sales funnel can influence how visitors move through the funnel and whether they eventually convert. In this little demo I will be showing you how to build a simple, one-page sales funnel using Node JS, Cosmic JS, and Stripe for handling credit card payments.

## TL;DR
* <a href="https://crowd-pitch.cosmicapp1.co/" target="_blank">Demo</a>
* <a href="https://github.com/mtermoul/crowd-pitch" target="_blank">Source code</a>
* <a href="https://stripe.com/docs/stripe-js/elements/quickstart/" target="_blank">Stripe</a>
* <a href="https://cosmicjs.com/" target="_blank">Cosmic JS</a>

## Why did I pick Cosmic JS
If you need to build a sales page quickly and freely, you can simply sign up for a free Cosmic JS account, copy my app, customize it and you're done. You'll have you sale funnel page ready in minutes. If you need to add a section or features then you can simply download the source-code and change any of the markup or the JavaScript behind this application.

## How to clone your own version of this app:
In order for you to clone this application and have your own custom copy, you need to following these steps:

* Sign up for a free Cosmic JS account
* Login into Cosmic JS account
* Go to the <a href="https://cosmicjs.com/buckets">buckets</a> page
* Click on `Add New Bucket` button on the top right of the page
* Select `Choose an app below option` and scroll to the applications list
* Try to find the `Sales Funnel` application
* Once you open the application click on the `Install Free` button
* You can keep the same title and hit the `Install App` button to confirm
* Then you will be taken to the application bucket
* Then you need to clone the github repo. Open the terminal window and type:

```
git clone https://github.com/cosmicjs/crowd-pitch
cd crowd-pitch
npm install
```

* edit and change Cosmic JS and Stripe API keys located in `/crowd-pitch/.env.local` file

```
COSMIC_BUCKET=your-bucket-slug
COSMIC_READ_KEY=your-cosmic-read-key
COSMIC_WRITE_KEY=your-cosmic-write-key
STRIPE_KEY=your-stripe-api-key
```

* Run the app server on your local machine

```
# start the app
npm run server

```

* open the application from your browser on <a href="http://localhost:3000">http://localhost:3000</a>

## How to customize the application content
In order for you to change the text, images, and application content you need to follow these steps:

* Login to <a href="https://cosmicjs.com/buckets">Cosmic JS dashboard</a>
* Go to buckets --> crowd-pitch
* Go to Pages --> Google cash machine
* Change the pages section by editing the text for each part of the web page like the page title, header....
* Change the page images by adding your own images. Make sure to keep the same image title and slug.
* Hit save and publish
* This part works like any CMS system, where you make changes to the back-end and the site can change immediately.

## How to add new features to this application
This part and below would be an explanation on how the application front-end was developed and how you can dig deeper to customize more options like the layout, css, colors, and which fields to collect from the user. This application was build mainly using Node JS, and Stripe API. So let's take a look at the server.js file


```
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
var Cosmic = require('cosmicjs');

const PORT = process.env.PORT || 3000
var app = express();
const stripeKey = process.env.STRIPE_KEY || 'sk_test_KnzjNDXECWprpt8ZvkOxs8Qz00tJfDiWYf';
const stripe = require('stripe')(stripeKey);
const bucket_slug = process.env.COSMIC_BUCKET || 'crowd-pitch';

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
const api = Cosmic();
const bucket = api.bucket({
    slug: bucket_slug
});

app.get('/', async function(req, res) {
    const data = (await bucket.getObjects({type: 'pages'})).objects;
    res.locals.cosmic = data.find((item) => {
        return item.slug === 'google-cash';
    });
    res.render('home');
});

app.post('/pay', function(req, res) {
    stripe.charges.create({
        amount: Number(req.body.amount) * 100, // amount in cents
        currency: 'usd',
        description: `${req.body.firstName} ${req.body.lastName} (${req.body.email}) - ${req.body.orderSummary}`,
        source: req.body.stripeToken,
        statement_descriptor: 'CROWD-PITHC GOOG CASHM'
    })
    .then(charge => {
        res.send(charge);
    })
    .catch(error => {
        console.log('--- Error:', error);
        res.status(500).send(error);
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
```

As you can see from the code above we are using the following Javascript components:

* <a href="https://www.npmjs.com/package/express">Express:</a> a light weight web server for node
* <a href="https://www.npmjs.com/package/express-handlebars">Express-Handlebars:</a> This html templating library for handlebars.js syntax
* <a href="http://handlebarsjs.com/">CosmicJs:</a> to handle interaction with Cosmic JS API from the server
* <a href="https://www.npmjs.com/package/stripe">Stripe:</a> to handle interaction with <a href="https://stripe.com/docs/payments">Stripe payment API</a>

Inside the server.js there is basically two function to handle server routing:

* app.get('/') to handle the get request when the user visits the application. Inside this function we simply call Cosmic JS to fetch all data from our bucket and inject it as a server response local variable. The second part is just rendering the home view which is just an HTML/Handlebars template page.
* app.post('/pay') to handle the payment form posting. Inside this function there is simply one call to Stripe charges API to add one charge to the specified credit card.

## How to customize the layout and CSS for the application?
As mentioned before, in this app we are using handlebars.js for the page templating. From the server get function we render `views/home.handlebars` page which is simply an html page with some handlebars tags to replace server variables with values from Cosmic JS CMS. Let's take a look:

```
<div class="container-fluid">
    <div class="row top-banner text-center bg-alt-1">
        <div class="col-sm"></div>
        <div class="col-sm">
           <img src="{{ cosmic.metadata.top_logo.url }}" alt="Crowd-Pith-Logo" height="100" class="brand-logo mt-2 mb-2">
        </div>
        <div class="col-sm"></div>
    </div>
</div>

<div class="container-fluid content-main">
    <div class="row text-center pt-4 content-section">
        <div class="col-lg">
            <h2 class="display-4 title-1">{{ cosmic.metadata.main_header }}</h2>
            {{#each cosmic.metadata.sub_headers }}
                <h1 class="title-2{{#if @first}} pt-4{{/if}}">{{ header }}</h1>
            {{/each}}
            {{#each cosmic.metadata.top_description.[0] }}
                <div class="p-1{{#if @first}} pt-4{{/if}}{{#if @last}} pb-4{{/if}}">{{this}}</div>
            {{/each}}
        </div>
    </div>
...
```

As you can see, we reference server variables within a double curly brackets. For instance `{{ cosmic.metadata.top_logo.url }}` means get the value of variable from Cosmic JS, which the logo image url and put it in the home view page. There are also similar syntax to handle if and loop using handlebars syntax. For a full syntax help, please refer to <a href="http://handlebarsjs.com/">Handlebars User Documentation</a>.

You can also change some of the styling of the page from within home view page because we are simply using <a href="https://getbootstrap.com/docs/4.3/getting-started/introduction/">Bootstrap framework</a>. For some other styling properties you can change it directly from `/public/css/styles.css`

For the application layout there the file `/views/layouts/main.handlebars`

```
<!doctype html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{{ cosmic.metadata.site_title }}</title>
    <script src="https://js.stripe.com/v3/"></script>
    <link rel="icon" href="images/crowd-pitch-fav-icon.png">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css?family=Fjalla+One|Lato|Montserrat|Oswald|Roboto" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <div class="container-fluid">
        <div class="row">
            {{{body}}}
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.js"></script>
    <script type="text/javascript">
        // Create a Stripe client.
        var stripe = Stripe('pk_test_izLBOGP9AifiSKEUMR1mEwCc00a6YtHFf1');
        // Create an instance of Elements.
        var elements = stripe.elements();
    </script>
    <script src="js/stripe.js"></script>
    <script src="js/main.js"></script>
</body>
</html>
```

This is basically the main html template for every page in our application. It's worth mentioning that we are referencing a couple of libraries from the client side like:

* JQuery
* Stripe
* Bootstrap
* Font-awesome
* Axios.js to handle Ajax calls

## Handling credit card payment with Stripe and Axios
To accept credit card payments in our application we use three steps process.

first we use <a href="https://stripe.com/docs/stripe-js/elements/quickstart">Stripe card elements</a> to inject the credit card input element inside our html form.

```
// Create a Stripe client.
var stripe = Stripe('your-stripe-api-key');
// Create an instance of Elements.
var elements = stripe.elements();

// Create an instance of the card Element.
var card = elements.create('card', {
    hidePostalCode: true,
    style: style});

// Add an instance of the card Element into the `card-element` <div>
card.mount('#card-element');
```

* Validate the credit card info by calling stripe.createToken when the user hit the submit payment button. This function will simply send the info to Strip API and get a valid token if success. Otherwise it will return an invalid token.

* Post the payment form form data to the server post method. This method will take data submitted from the client form and submit them again as a stripe charge by calling stripe.charges.create. Take a look:

```
...
app.post('/pay', function(req, res) {
    stripe.charges.create({
        amount: Number(req.body.amount) * 100, // amount in cents
        currency: 'usd',
        description: `${req.body.firstName} ${req.body.lastName} (${req.body.email}) - ${req.body.orderSummary}`,
        source: req.body.stripeToken,
        statement_descriptor: 'CROWD-PITHC GOOG CASHM'
    })
    .then(charge => {
        res.send(charge);
    })
    .catch(error => {
        console.log('--- Error:', error);
        res.status(500).send(error);
    });
});
...
```

As you can see, once the charge is sent to stripe, we will return success to the client if no errors from Stripe. Otherwise we will emit Stripe errors back to the client.

* The last step is on the client side, we will display the payment result on the client form if success, or the error message if the payment fails.

## How to add multiple page funnel to my application.
Sometimes the application will need more than one page to capture the user final action. If you want to do that, you can simply add more pages to the server view, more routes, and handle the post from one page to the other either via javascript functions or server post methods.

## What about the main.js file?
This file contains one function right now to handle count down counter. However you can use it if you any other javascript interactions with your user. For the count down counter we store a variable on Cosmic JS server called

```
const dealCountDown = {{ cosmic.metadata.deal_countdown }};

```

and then we calls the `initializeClock` function which will run the count down until this variable reaches zero.

Take a look at the main.js file for the full implementation details.

<img src="../public/images/crowd-pitch-preview.gif" alt="Crowd-Pitch main view" style="display: block; margin-left: auto; margin-right: auto;">

## Check user engagement with A/B testing
As most marketers have come to realize, the cost of acquiring any quality traffic can be huge. A/B testing lets you make the most out of your existing traffic and helps you increase conversion without having to spend on acquiring new traffic. A/B testing can give you high ROI as sometimes, even the most minor changes can result in a significant increase in conversions.
For the purpose of this app, I will add to `style.css` files and once the user visits the site I will be randomly selecting one stylesheet. The stylesheet selection will affect how the color theme will look like. So basically the user can see either version A of the site or version B.

```
# server.js
app.get('/', async function(req, res) {
    ...
    const pageVeriant = Math.floor(Math.random() * 2);
    res.locals.pageB = (pageVeriant === 1 ? true : false);
    res.render('home');
});
```

Then we load either style A or B on the `main.handlebars` file like this:

```
...
    {{#if pageB }}
    <link rel="stylesheet" href="css/styleB.css">
    {{else }}
    <link rel="stylesheet" href="css/style.css">
    {{/if}}
...

```

We also have a javascript variable that will be used during the payment process to capture which page the user is coming from. This info will be stored along Stripe charge information.

```
    const pageSource = {{#if pageB}} 'pageB' {{else}} 'pageA' {{/if}};
```

then we save the page source along the stripe charge on the server post method.

```
stripe.charges.create({
    amount: Number(req.body.amount) * 100, // amount in cents
    currency: 'usd',
    description: `${req.body.firstName} ${req.body.lastName} (${req.body.email}) - ${req.body.orderSummary} - Source: ${req.body.pageSource}`,
    source: req.body.stripeToken,
    statement_descriptor: 'CROWD-PITHC GOOG CASHM'
})

```

## Conclusion
In this application, I've demonstrated how you can build a page that displays product info and handles credit card payments by leveraging the power of the Cosmic JS CMS plus a few other libraries that handle the payment function. You can add a function that will send an email to the user after the payment is submitted. Or add a function to send a user to another secure page to all him to download the digital product. The Cosmic JS Community  has a lot of examples on how to handle integration with email functions, download functions, and third party platforms.

As always, I really hope that you enjoyed this little app, and please do not hesitate to send me your thoughts or comments about what could I have done better.

If you have any comments or questions about building apps with Cosmic JS, <a href="https://twitter.com/cosmic_js">reach out to us on Twitter</a> and <a href="https://cosmicjs.com/community">join the conversation on Slack</a>.
