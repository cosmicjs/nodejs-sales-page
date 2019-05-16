const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
var Cosmic = require('cosmicjs');


require('dotenv').config();
const PORT = process.env.PORT || 3000
var app = express();
const stripeKey = process.env.STRIPE_KEY;
const stripePublishKey = process.env.STRIPE_PUBLISH_KEY;
const stripe = require('stripe')(stripeKey);
const bucket_slug = process.env.COSMIC_BUCKET || 'crowd-pitch';

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(session({
    secret: 'crowd pitch keep secret',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}))
const api = Cosmic();
const bucket = api.bucket({
    slug: bucket_slug
});

app.get('/', async function(req, res) {
    // const pageVeriant = Math.floor(Math.random() * 2);
    res.locals.stripePublishKey = stripePublishKey;
    const data = (await bucket.getObjects({type: 'pages'})).objects;
    res.locals.cosmic = data.find((item) => {
        return item.slug === 'google-cash';
    });
    if (!req.session.pageVariant) {
        req.session.pageVariant = Math.floor(Math.random() * 2);
    }
    res.locals.pageB = (req.session.pageVariant === 1 ? true : false);
    res.render('home');
});

app.post('/pay', function(req, res) {
    stripe.charges.create({
        amount: Number(req.body.amount) * 100, // amount in cents
        currency: 'usd',
        description: `${req.body.firstName} ${req.body.lastName} (${req.body.email}) - ${req.body.orderSummary} - Source: ${req.body.pageSource}`,
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
