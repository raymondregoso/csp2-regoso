const stripe = Stripe('capstone3');
const elements = stripe.elements();

const cardElement = elements.create('card');
cardElement.mount('#card-element');

// Handle form submission
const form = document.getElementById('payment-form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Create a token from the card information
  const { token, error } = await stripe.createToken(cardElement);

  if (error) {
    // Handle errors from creating the token
    console.error(error);
    // You may want to display the error to the user
    // e.g., document.getElementById('card-errors').textContent = error.message;
  } else {
    // Send the token to your server
    fetch('/b6/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 500000, 
        currency: 'php', 
        payment_method: token.id,
        confirmation_method: 'manual', 
      }),
    })
      .then(response => response.json())
      .then(data => {
        // Handle the server response
        console.log(data);
        // You may want to display a success message to the user
      })
      .catch(error => {
        // Handle errors from the server
        console.error(error);
        // You may want to display the error to the user
        // e.g., document.getElementById('card-errors').textContent = 'Payment failed';
      });
  }
});
