// [SECTION] Dependecies and Modules
const jwt = require("jsonwebtoken");

// Used in the algorithm for encrypting our data which makes it difficult to decode
const secret = "ProductBookingAPI";

// [SECTION] Token Creation
module.exports.createAccessToken = (user) => {

	// When the user logs in, a token will be created with user's information
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	}
	// Generate a JSON web token using the sign() method
	// the data = payload, secret = used for encryption, {} = for options
	return jwt.sign(data, secret, {});
}




// [SECTION] Token Verification
module.exports.verify = (req, res, next) => {

	// This is provided in postman under
	// Authorization > Bearer Token
	console.log(req.headers.authorization);

	let token = req.headers.authorization;

	// Check if the token (JWT) exists
	if(typeof token === "undefined"){

		return res.send({ auth: "Failed. No Token" });
	
	} else {

		console.log(token);
		// This is the data that will be received from req.headers.authorization
		// "Bearer eadsfadsgksaldfksadfkxvczmnzxlcvnjlkasdfdsafdsaffdslkgjasdfarewaroiuasdfasdwearoFDodsafGosadfoadsfkSDFokjsg"
		token = token.slice(7, token.length);
		console.log(token);  // OUTPUT "eadsfadsgksaldfksadfkxvczmnzxlcvnjlkasdfdsafdsaffdslkgjasdfarewaroiuasdfasdwearoFDodsafGosadfoadsfkSDFokjsg"

		jwt.verify(token, secret, function(err, decodedToken){

			if(err){
				return res.send({
					auth: "Failed",
					message: err.message
				})
			} else {

				console.log(decodedToken) //contain the data from our token
			
				req.user = decodedToken;
				// user property will be added to request object (req) and will contain our payload (decodedToken)
				// It can be accessed in the next middleware/controller.

				// next() will let us proceed to the next middleware OR controller
				next();
			}
		});
	}
}

// [SECTION] verifyAdmin - Verify if the logged in user is an Admin
module.exports.verifyAdmin = (req, res, next) => {

	// Note: You can only have req.user for any middleware or controller that comes after verify

	if(req.user.isAdmin){

		next();
	} else {

		return res.send({
			auth: "Failed",
			message: "Action Forbidded"
		})
	}
}