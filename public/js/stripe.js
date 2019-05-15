
var style = {
    base: {
        fontSize: '16px'
    }
};

// Create an instance of the card Element.
var card = elements.create('card', {
    hidePostalCode: true,
    style: style});

// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element');

// Handle real-time validation errors from the card Element.
card.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

// Handle form submission.
var form = document.getElementById('payment-form');
form.addEventListener('submit', function(event) {
  event.preventDefault();

  var additionalData = {
    name: (form.querySelector('#first-name') ? form.querySelector('#first-name').value : undefined) +
        ' ' +
        (form.querySelector('#last-name') ? form.querySelector('#last-name').value : undefined),
    email: form.querySelector('#email') ? form.querySelector('#email').value : undefined,
    address_zip: form.querySelector('#zip-code') ? form.querySelector('#zip-code').value : undefined
  };

  stripe.createToken(card, additionalData).then(function(result) {
    if (result.error) {
      // Inform the user if there was an error.
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
      // Send the token to your server.
      stripeTokenHandler(result.token);
    }
  });
});

// Submit the form with the token ID.
function stripeTokenHandler(token) {
  // Insert the token ID into the form so it gets submitted to the server
  var form = document.getElementById('payment-form');

  disablePaymentForm('Processing Payment...');

  const data = {
    firstName: document.getElementById('first-name').value,
    lastName: document.getElementById('last-name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    stripeToken: token.id,
    zipCode: document.getElementById('zip-code').value,
    orderSummary: document.getElementById('order-summary').value,
    amount: document.getElementById('amount').value,
    pageSource: pageSource
  };
  axios.post('/pay', data)
    .then(response => {
        console.log('--- Payment success ---');
        disablePaymentForm('SUCCESS');
        $('#payment-result')
            .text('Thank you for your purchase. You should receive a confirmation email, and the links to download your material.')
            .removeClass('text-danger')
            .addClass('text-success');
    })
    .catch(error => {
        console.log('--- Payment error: ', error);
        enablePaymentForm('Pay Now');
        $('#payment-result')
            .text(error.message + ' (' + error.response.data.message + ') Please verify your information and try again!')
            .removeClass('text-success')
            .addClass('text-danger');
    });

  // Submit the form
  // form.submit();
}

function disablePaymentForm(buttonText) {
    $('#payment-form :input').prop('disabled','disabled');
    $('#payment-form button').text(buttonText);
}

function enablePaymentForm(buttonText) {
    $('#payment-form :input').prop('disabled',false);
    $('#payment-form button').text(buttonText);
}
