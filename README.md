# Project 3

## Django 3.0
I used Django 3.0 due to security issues including SQL injection vulnerability to the Database.
The recommended version is Django 2.1.0

## Index/Home Page
Shows pre-made Pizza's for users to add to their carts including an option to select how many Pizza's and what size.

## Login Page
Here is for the user to login (The user can browse the App without needing an account, but if they try to order they need one).

## Register Pop-Up
If the user wants to Register they can just click on the `Sign Up` at the top-right conner of the Navbar and a Pop-Up will show with the required fields. The Javascript will check the `username` and `email` to see if they can be used.

## Build Pizza
Users can build custom pizzas.

The options are:
1. `Pizza Size`
2. `Pizza Crust`
3. `Number of Toppings`
4. `Toppings`

After selecting everything, they then need to select `Quantity` of Pizzas they want (min:1, max:20).

When everything is done they can add it to the Cart.

## Add Topping
(Only Staff Access Allowed)
Here only Staff can add toppings to the list of available toppings and manage them.

~ Available Fields ~
1. `Topping Name`
2. `Choose Uploading Image`
3. `Topping Price`

~ For Available Topping ~
1. `Toggle ON/OFF switch`
2. `Change Topping Price`
3. `Remove Topping`

## Pizza Orders
(Only Staff Access Allowed)
Here Staff can see the Pizza orders that have been made and are `waiting` to be done.
It also includes a list for `Done` and `Denied` orders.

When Orders are done and email will be sent to the user that made the order telling them it is done and ready.

## Cart
Here users can see the items they have in their `Cart`.
That include:
1. `Waiting` = These are items waiting to be checked out.
2. `In Process` = These are items that have already been checked out and are waiting to be processed by staff.
3. `Done` = These are items that are done.
4. `Denied` = These are items that have been denied by Staff.

## Account Page
Users can see all information we store about them including how many orders they've made, Done orders and Denied orders.


Web Programming with Python and JavaScript
