
## E-COMMERCE API DOCUMENTATION

***INSTALLATION COMMAND:***

```npm install express mongoose cors jsonwebtoken``` 

***TEST ACCOUNTS:***
- Regular User:
     - email: raymondregoso@gmail.com
     - pwd: admin1234

     - email: test@gmail.com
     - pwd: admin1234
- Admin User:
    - email: admin@gmail.com
    - pwd: admin1234
    

***ROUTES:***
- User registration (POST)
	- http://localhost:4000/users/register
    - auth header required: NO
    - request body: 
    	- firstName (string)
    	- lastName (string)
    	- email (string)
        - mobileNo (string)
        - password (string)
- User authentication/Login User (POST)
	- http://localhost:4000/users/login
    - auth header required: NO
    - request body: 
        - email (string)
        - password (string)
- Create Product (Admin only) (POST)
	- http://localhost:4000/products/create
    - auth header required: YES
    - request body: 
        - name (string)
        - description (string)
        - price (number)
- Retrieve all products (GET)
	- http://localhost:4000/products/all
    - auth header required: YES
    - request body: none
- Retrieve all active products (GET)
	- http://localhost:4000/products/active
    - auth header required: NO
	- request body: none
- Retrieve single product (GET)
	- http://localhost:4000/products/:productId
    - auth header required: NO
	- request body: none
- Update product information (Admin only) (PUT)
	- http://localhost:4000/products/:productId
    - auth header required: YES
	- request body: 
		- price (number)
- Archive product (Admin only) (PUT)
	- http://localhost:4000/products/:productId/archive
    - auth header required: YES
	- request body: none
- Activate product (Admin only) (PUT)
	- http://localhost:4000/products/:productId/archive
    - auth header required: YES
	- request body: none
- Retrieve user details (GET)
	- http://localhost:4000/users/details
    - auth header required: YES
	- request body: none
- Non-admin user checkout (POST)
	- http://localhost:4000/orders/addToOrder
    - auth header required: YES
    - request body: 
        - userId (string)
        - productId (string)
        - quantity (number)
- Retrieve all orders (Admin only) (GET)
	- http://localhost:4000/users/getAllOrders
    - auth header required: YES
	- request body: none
- Update user to admin (Admin only) (PUT)
	- http://localhost:4000/users/setAsAdmin
    - auth header required: YES
	- request body:
		- userId (string)
- Add to cart (POST)
	- http://localhost:4000/orders/addToCart
    - auth header required: YES
    - request body: 
        - userId (string)
        - productId (string)
        - quantity (number)
- Update cart item (PUT)
	- http://localhost:4000/orders/updateCartItem/:productId
    - auth header required: YES
    - request body: 
        - userId (string)
        - quantity (number) 
- Remove cart item (DELETE)
	- http://localhost:4000/orders/removeCartItem/:productId
    - auth header required: YES
    - request body: 
        - userId (string)
- Get Subtotal and total (GET)
	- http://localhost:4000/orders/calculateSubtotalAndTotal
    - auth header required: YES
    - request body: 
        - userId (string)
- Get cart details (GET)
	- http://localhost:4000/orders/getCart
    - auth header required: YES
    - request body: none
        
 
      

