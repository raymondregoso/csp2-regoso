// [SECTION] Dependencies and Modules
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require ("../models/Order");
const Checkout = require ("../models/Checkout");
const bcrypt = require("bcrypt");
const auth = require("../auth");

// [SECTION] Check if the email already exists
// Session 49
module.exports.checkEmailExists = (reqBody) => {
  const { email } = reqBody;

  return User.findOne({ email })
    .then(existingUser => {
      // The result is sent back to the frontend via the "then" method found in the route file
      // Check if the result array is empty or not
      return { exists: !!existingUser }; // Set the 'exists' property explicitly
    })
    .catch(error => {
      console.error('Error checking email existence:', error);
      return { exists: false }; 
    });
};

// [SECTION] User registration
module.exports.registerUser = (reqBody) => {

	// Creates a new user object named "newUser" using the mogoose model "User"
	let newUser = new User({
		firstName: reqBody.firstName,
		lastName: reqBody.lastName,
		email: reqBody.email,
		mobileNo: reqBody.mobileNo,
		password: bcrypt.hashSync(reqBody.password, 10)
	});

	// Saves the created object to our database
	return newUser.save().then((user, error) => {

		// User registration failed
		if(error){

			return false;

		// User registration successful
		} else {

			return true
		}
	})

}

// [SECTION] User Authentication
module.exports.loginUser = (req, res) => {

	// We use the "findOne" method instead of the "find" method which returns all records that match the search criteria
	return User.findOne({ email: req.body.email }).then(result => {

		// Check if user does not exist
		if(result == null){
		
			return res.send(false);

		// If user exists
		} else {
			// Creates the variable "isPasswordCorrect" to return the result of comparing the login form password and the database password
			const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

			// Check if the passwords are the same
			if(isPasswordCorrect) {

				// Generate an access token
				return res.send({ access: auth.createAccessToken(result) })

			// Passwords do not match
			} else {

				return res.send(false);
			}

		}

	});

}






// Session 52
// Retrieve user details
module.exports.getProfile = (req, res) => {

	return User.findById(req.user.id).then(result => {

		result.password = "";

		return res.send(result);

	})
	.catch(error => res.send(error));
}





// From ChatGPT
// Function to reset the password
module.exports.resetPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { id } = req.user; // Extracting user ID from the authorization header

    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hashing the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Updating the user's password in the database
    await User.findByIdAndUpdate(id, { password: hashedPassword });

    // Sending a success response
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


 module.exports.updateProfile = async(req, res) => {
  try {
    // Get the user ID from the authenticated token
    const userId = req.user.id;

    // Retrieve the updated profile information from the request body
    const { firstName, lastName, mobileNo } = req.body;

    // Update the user's profile in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, mobileNo },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
}

// User set as to Admin account (admin only)
module.exports.updateToAdmin = async (req, res) => {
    try {
      const { userId } = req.body;

      // Find the user by ID
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update the user's status to admin
      user.isAdmin = true;

      await user.save();

      res.status(200).json({ message: 'User updated as admin successfully' });
    } catch (error) {
      console.error('Error updating user to admin:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }





// STRETCH GOAL
// Get all orders of users(admin only)
module.exports.getAllOrders = (req, res) => {
  Order.find({})
    .then((result) => {
      return res.send(result);
    })
    .catch((error) => {
      console.error("Error in getAllOrders:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    });
};

// Get specific user's all order
module.exports.getAllOrdersForUser = (req, res) => {
  const userId = req.params.userId;

  Order.find({ userId })
    .then((orders) => {
      return res.send(orders);
    })
    .catch((error) => {
      console.error("Error in getAllOrdersForUser:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    });
};

// Get all checkouts of the users
module.exports.getAllCheckouts = (req, res) => {
  Checkout.find({})
    .then((result) => {
      return res.send(result);
    })
    .catch((error) => {
      console.error('Error in getAllCheckouts:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    });
};


module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => {
      users.forEach((user) => {
        user.password = "";
      });
      return res.send(users);
    })
    .catch((error) => {
      console.error("Error in getAllUsers:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    });
};

// Route for updating user account to regular user account
module.exports.updateToUser = async (req, res) => {
  try {
    const { userId } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's status to a regular user
    user.isAdmin = false;

    await user.save();

    res.status(200).json({ message: 'User updated as regular user successfully' });
  } catch (error) {
    console.error('Error updating user to regular user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.editUser = (req, res) => {
  const { userId } = req.params;

  // Extract the updated user data from the request body
  const { firstName, lastName, mobileNo, email, newPassword } = req.body;

  // Check if the admin is trying to update their own profile
  if (userId === req.user.id) {
    return res.status(403).json({ message: 'Admin cannot update their own profile' });
  }

  // Update the user's profile in the database
  User.findByIdAndUpdate(
    userId,
    { firstName, lastName, mobileNo, email },
    { new: true }
  )
    .then(updatedUser => {
      // Check if a new password is provided and update the password if necessary
      if (newPassword) {
        // Hashing the new password
        const hashedPassword = bcrypt.hashSync(newPassword, 10);

        // Updating the user's password in the database
        updatedUser.password = hashedPassword;
        return updatedUser.save();
      }

      return updatedUser;
    })
    .then(updatedUser => {
      // Omit password from the response
      updatedUser.password = '';

      res.json(updatedUser);
    })
    .catch(error => {
      console.error('Error updating user profile by admin:', error);
      res.status(500).json({ message: 'Failed to update user profile by admin' });
    });
};

module.exports.getUserById = (req, res) => {
  const userId = req.params.userId;

  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Exclude sensitive information like password before sending the user data
      const userWithoutPassword = { ...user._doc, password: undefined };

      res.json(userWithoutPassword);
    })
    .catch(error => {
      console.error('Error fetching user by ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
};

module.exports.deleteUser = async (req, res) => {
  try {
    const userIdToDelete = req.params.userId;

    // Use deleteOne to delete the user by ID
    const result = await User.deleteOne({ _id: userIdToDelete });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};