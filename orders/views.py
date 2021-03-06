from django.http import HttpResponse, Http404, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.core.files.storage import FileSystemStorage
from django.core.mail import send_mail

import os

from .models import Pizza, Pizza_order, Cart, Topping


def index(request):
    """Used for Home page"""

    messages = ""

    if request.method == "POST":

        if request.user.is_authenticated:
            
            # Get the pizza ID, SIze and quantity being requested to put in the cart
            pizza_id = int(request.POST["pizza_id"])
            pizza_size = str(request.POST["pizza_size"])
            quantity = int(request.POST["quantity"])

            # Replace the single letter with the full word in lower case
            if pizza_size == "S":
                pizza_size = "small"
            elif pizza_size == "M":
                pizza_size = "medium"
            elif pizza_size == "L":
                pizza_size = "large"
            else:
                # If the letter does not match any of the valid ones reload the page and don't tell why
                return HttpResponseRedirect(reverse("index"))

            # Check if the quantity being requested is valid
            if quantity > 0 and quantity < 21:

                # Get the information about the Pizza from the Database
                f =  Pizza.objects.get(pk=pizza_id)

                # Get the value added by each size of the pizza
                if pizza_size == "small":
                    value_S += 120
                elif pizza_size == "medium":
                    value_S += 160
                elif pizza_size == "large":
                    value_S += 200

                total_value_Q = (f.price + value_S) * quantity # Muiltiply the price + value Size by the quantity

                # Add the order to the Cart
                q = Cart(owner_id = int(request.user.pk),
                        size = pizza_size,
                        crust = "small",
                        toppings = f.topping,
                        selected_toppings = f.ingredients,
                        quantity = quantity,
                        total_value = f.price,
                        total_value_Q = total_value_Q)
                q.save() # Save it to the Database

                messages = "Successfully added to cart."
            else:
                return HttpResponseRedirect(reverse("index"))

        else:
            messages = "Please Login to add to cart."

    try:
        len(Cart.objects.filter(owner_id=request.user.pk, status="waiting"))
        cart_n = len(Cart.objects.filter(owner_id=request.user.pk, status="waiting"))
    except:
        cart_n = 0

    try:
        pizza = Pizza.objects.all()
    except:
        pizza = ""

    html_content = {
        "pizzas": pizza,
        "messages": messages,
        "cart_items": cart_n
    }

    return render(request, "pizza/index.html", html_content)

def register(request):
    """Used for sign up/register page"""

    # Check if the request is POST
    if request.method == "POST":

        # Get the credentials to use to register the user
        username = str(request.POST["username"])
        first_name = str(request.POST["first_name"])
        last_name = str(request.POST["last_name"])
        e_mail = str(request.POST["e_mail"])
        password = str(request.POST["password"])
        passwordconfirm = str(request.POST["passwordconfirm"])

        if password != passwordconfirm:
            print("Passwords don't match")

        # Iniatialize variable
        result = {}

        # Check if the username already exists in the Database
        try:
            User.objects.get(username=username)
            result["USERNAME_CHECK"] = True
        except User.DoesNotExist:
            result["USERNAME_CHECK"] = False

        # If the username does exist send a message
        if result["USERNAME_CHECK"]:
            print("username exists! Please use another one.")

        # Check if the email already exists in the Database
        try:
            User.objects.get(email=e_mail)
            result["EMAIL_CHECK"] = True
        except User.DoesNotExist:
            result["EMAIL_CHECK"] = False
        
        # If the username does exist send a message
        if result["EMAIL_CHECK"]:
            print("email exists! Please use another one.")
        
        # If the credentials are valid register the user to the Database
        if not result["EMAIL_CHECK"] and not result["USERNAME_CHECK"]:
            f = User.objects.create_user(username=username,
                                        email=e_mail,
                                        first_name=first_name,
                                        last_name=last_name,
                                        password=password)
            f.save()
            send_mail("Droid Pizza",
                        "Thank You For Registering at Droid Pizza. Now you can order as many pizza's you want :D.",
                        os.getenv("EMAIL"),
                        [f.email],
                        fail_silently=False,
                        html_message="<h3>Thank You For Registering at Droid Pizza.</h3> <br> Now you can order as many pizza's you want :D.")

        return HttpResponseRedirect(reverse("index"))


def check_signup(request, check):
    """Check if the username can be used"""

    # Make sure method is POST
    if request.method == "POST":

        # Check if the username already exist in the Database
        if check == "checkusername":
            username = str(request.POST["username"])
            try:
                User.objects.get(username=username)
                return JsonResponse({"USERNAME_STATUS": "BAD"})
            except User.DoesNotExist:
                return JsonResponse({"USERNAME_STATUS": "GOOD"})

        # Check if the email address is already in use in the Database
        elif check == "checkemail":
            email = str(request.POST["email"])
            try:
                User.objects.get(email=email)
                return JsonResponse({"EMAIL_STATUS": "BAD"})
            except User.DoesNotExist:
                return JsonResponse({"EMAIL_STATUS": "GOOD"})
        else:
            return JsonResponse({"EMPTY": "EMPTY"})


def account(request, messages=None):
    """Account page"""

    # Check if the user is login otherwise send them to the login page
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse("login"))

    # Check for messages from when password is changed
    if not messages:
        messages = ""
    elif messages == 1:
        messages = {"msg":"Your old password is wrong! Please try again.", "msgn":1}
    elif messages == 2:
        messages = {"msg":"Passwords don't match! Please try again.", "msgn":2}
    elif messages == 3:
        messages = {"msg":"Password doesn't meet our requirements!", "msgn":3}
    elif messages == 4:
        messages = {"msg":"Password successfully changed! Thank You.", "msgn":4}
    else:
        messages = {"msg":"Something has gone wrong. Please contact the support team.", "msgn":0}

    # Get user's information from the database
    f = User.objects.get(pk=int(request.user.pk))

    html_content = {"username": f.username,
                    "first_name": f.first_name,
                    "last_name": f.last_name,
                    "email": f.email,
                    "amount_of_orders": len(Cart.objects.filter(owner_id=request.user.pk)),
                    "amount_of_waiting_orders": len(Cart.objects.filter(owner_id=request.user.pk, status="waiting")),
                    "amount_of_done_orders": len(Cart.objects.filter(owner_id=request.user.pk, status="done")),
                    "amount_of_denied_orders": len(Cart.objects.filter(owner_id=request.user.pk, status="denied")),
                    "cart_items": len(Cart.objects.filter(owner_id=request.user.pk, status="waiting")),
                    "messages": messages}

    return render(request, "pizza/account.html", html_content)


def account_cpwd(request):
    """Used to change the accounts password"""

    if request.method == "POST":

        # Get the old, new, confirm passwords
        opwd = str(request.POST["opwd"])
        npwd = str(request.POST["npwd"])
        cpwd = str(request.POST["cpwd"])

        # Check if the old password is the current one
        if authenticate(request, username=request.user.username, password=opwd):
            # Check if the new and confirmed password match
            if npwd == cpwd:
                # Check if the new password meets requirements
                if len(npwd) > 7 and len(npwd) < 65:
                    # Change the user's password to the new one
                    f = User.objects.get(pk=request.user.pk)
                    f.set_password(npwd)
                    f.save()
                    error_message = 4
                else:
                    error_message = 3
            else:
                error_message = 2
        else:
            error_message = 1
        
        return HttpResponseRedirect(reverse("account_msg", args=(error_message,)))

    return HttpResponseRedirect(reverse("account"))


def add_topping(request):
    """Used to add an available topping"""
    
    # Check if the user is login otherwise send them to the login page
    if not request.user.is_staff:
        return HttpResponseRedirect(reverse("login"))

    if request.method == "POST":
        
        # Check if the image file is present
        if request.FILES["topping_image"]:

            # Get the topping name, picture and price
            topping = str(request.POST["add_topping"])
            topping_img = request.FILES["topping_image"]
            topping_price = int(request.POST["price"])

            # Prep storage
            fs = FileSystemStorage()
            # Make sure to replace all spaces with under score and lower case all letters
            new_filename = topping.replace(" ", "_").lower()

            # Save the topping picture in the directory and give is the proper format ending
            filename = fs.save(new_filename+"."+topping_img.name.split(".")[1], topping_img)
            fs.url(filename)

            Topping(name=topping, price=topping_price, image=new_filename+"."+topping_img.name.split(".")[1]).save()

            return HttpResponseRedirect(reverse("add_topping")) 
    
    elif request.method == "GET":

        html_content = {"topping": Topping.objects.all(),
                        "cart_items": len(Cart.objects.filter(owner_id=request.user.pk, status="waiting"))}

        return render(request, "pizza/add_topping.html", html_content)


def remove_topping(request):
    """Used to remove toppings"""

    if request.method == "POST":
        if request.user.is_staff:

            try:
                Topping.objects.get(pk=int(request.POST["topping_id"]))
            except Topping.DoesNotExist:
                return JsonResponse({"STATUS": False})

            f = Topping.objects.get(pk=int(request.POST["topping_id"]))
            images = os.listdir(str(os.getcwd())+"/static/pizza/img/topping_img/")
            if f.image in images:
                os.remove(os.getcwd()+"/static/pizza/img/topping_img/"+str(f.image))
                Topping.objects.get(pk=int(request.POST["topping_id"])).delete()

            return JsonResponse({"STATUS": True})
        else:
            return JsonResponse({"STATUS": False})
    else:
        return JsonResponse({"STATUS": False})


def switch_toggle_topping(request):
    """Used for topping available"""

    if request.method == "POST":
        if request.user.is_staff: # Check if user is Staff

            # Get Topping information
            f = Topping.objects.get(pk=int(request.POST["topping_id"]))

            if f:
                # Check if the Topping is available or not and switch the toggle from OFF to ON depending on the available status
                if str(f.available) == "OFF":
                    Topping.objects.filter(pk=int(request.POST["topping_id"])).update(available="ON")
                elif str(f.available) == "ON":
                    Topping.objects.filter(pk=int(request.POST["topping_id"])).update(available="OFF")

            return JsonResponse({"STATUS": True})
        else:
            return JsonResponse({"STATUS": False})
    else:
        return JsonResponse({"STATUS": False})


def new_price(request):
    """Used to change the price of toppings"""

    if request.method == "POST":
        if request.user.is_staff:
            if int(request.POST["new_price"]) > 0 and request.POST["topping_id"]:

                # Update the price of the topping
                Topping.objects.filter(pk=int(request.POST["topping_id"])).update(price=int(request.POST["new_price"]))

                return JsonResponse({"STATUS": True})
        else:
            return JsonResponse({"STATUS": False})
    return JsonResponse({"STATUS": False})


def login_page(request):
    """Used to log user in"""

    # Check if the user is logged in
    # if they are send them back to the index page
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse("index"))

    # Check if request method is POST
    if request.method == "POST":

        # Get the credentials needed to login
        username = str(request.POST["usernamelogin"])
        password = str(request.POST["passwordlogin"])

        # Authenticate the user login credentials
        user = authenticate(request, username=username, password=password)

        # Check if the user credentials are valid and log them in
        if user:
            login(request, user) # Login the user
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "pizza/login.html", {"message": "Invalid password/username."})
    else:
        return render(request, "pizza/login.html")

def logout_page(request):
    """Used to log out the user"""

    # Log the user out of the system
    logout(request)

    return HttpResponseRedirect(reverse("login"))

def build_pizza(request):
    """Used to test new page implemantations"""

    if request.method == "POST":

        if request.user.is_authenticated:
            
            user_info = int(request.user.pk) # GEt the users primary key
            size = str(request.POST["pizza_size"]) # Get the Pizza Size
            crust = str(request.POST["pizza_crust"]) # Get the Crust Size
            number_toppings = int(request.POST["number_toppings"]) # Get the amount of toppings wanted (min=1, max=3)
            
            # Get the topping primary key
            # ---------------------------------------------------------------------------------------------
            if request.POST["pizza_topping_1"] and request.POST["pizza_topping_1"] != "undefined":
                topping_1 = int(request.POST["pizza_topping_1"])
            else:
                topping_1 = None
            
            if request.POST["pizza_topping_2"] and request.POST["pizza_topping_2"] != "undefined":
                topping_2 = int(request.POST["pizza_topping_2"])
            else:
                topping_2 = None
            
            if request.POST["pizza_topping_3"] and request.POST["pizza_topping_3"] != "undefined":
                topping_3 = int(request.POST["pizza_topping_3"])
            else:
                topping_3 = None
            # ---------------------------------------------------------------------------------------------
            
            quantity = int(request.POST["quantity"]) # Get the quantity
            total_value = int(request.POST["total_value"]) # Get the static price
            total_value_Q = int(request.POST["total_value_Q"]) # Get the total price
            total_value_check = 0

            if size == "small":
                total_value_check = total_value_check + 120
            elif size == "medium":
                total_value_check = total_value_check + 140
            elif size == "large":
                total_value_check = total_value_check + 160
            
            if crust == "small":
                total_value_check = total_value_check + 50
            elif crust == "medium":
                total_value_check = total_value_check + 80
            elif crust == "large":
                total_value_check = total_value_check + 100
            
            f = Topping.objects.all()

            if topping_1:
                t1 = f.get(pk=topping_1)
                if t1.available == "ON":
                    topping_1 = t1.name
                    total_value_check = total_value_check + t1.price
                else:
                    return JsonResponse({"STATUS": "FAILED"})

            if topping_2:
                t2 = f.get(pk=topping_2)
                if t2.available == "ON":
                    topping_2 = t2.name
                    total_value_check = total_value_check + t2.price
                else:
                    return JsonResponse({"STATUS": "FAILED"})

            if topping_3:
                t3 = f.get(pk=topping_3)
                if t3.available == "ON":
                    topping_3 = t3.name
                    total_value_check = total_value_check + t3.price
                else:
                    return JsonResponse({"STATUS": "FAILED"})

            if total_value > total_value_check or total_value < total_value_check:
                return JsonResponse({"STATUS": "PRICE_T"})

            selected_toppings = None
            if number_toppings == 1:
                selected_toppings = str(topping_1)
            elif number_toppings == 2:
                selected_toppings = str(topping_1)+", "+str(topping_2)
            elif number_toppings == 3:
                selected_toppings = str(topping_1)+", "+str(topping_2)+", "+str(topping_3)

            f = Cart(owner_id = user_info,
                    size = size,
                    crust = crust,
                    toppings = number_toppings,
                    selected_toppings = selected_toppings,
                    quantity = quantity,
                    total_value = total_value,
                    total_value_Q = total_value_Q)
            f.save()
            
            return JsonResponse({"STATUS": "SUCCESS"})
        else:
            return JsonResponse({"STATUS": "FAILED_NO_LOG"})

    elif request.method == "GET":

        image = os.listdir(str(os.getcwd())+"/static/pizza/img/topping_img/")

        html_content = {"pizza_toppings": [],
                        "pizza_topping_names": [],
                        "cart_items": len(Cart.objects.filter(owner_id=request.user.pk, status="waiting")),
                        "topping": Topping.objects.all()}
        for alpha in range(len(image)):
        
            html_content["pizza_toppings"].append(image[alpha])
            html_content["pizza_topping_names"].append(image[alpha].split(".")[0])

        return render(request, "pizza/build_pizza.html", html_content)


def build_pizza_topping(request):
    """Used to get information about the selected topping"""

    if request.method == "POST":

        f = Topping.objects.get(pk=int(request.POST["topping_id"]))

    return JsonResponse({"topping_name": f.name,
                         "topping_id": f.pk,
                         "topping_price": f.price})


def cart_page(request):
    """Used to display the User cart"""

    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse("login"))

    if request.method == "POST":

        return HttpResponseRedirect(reverse("cart_page"))

    elif request.method == "GET":
        html_content = {"cart": Cart.objects.filter(owner_id=request.user.pk),
                        "cart_items": len(Cart.objects.filter(owner_id=request.user.pk, status="waiting")),
                        "cart_waiting": len(Cart.objects.filter(owner_id=request.user.pk, status="waiting")),
                        "cart_processing": len(Cart.objects.filter(owner_id=request.user.pk, status="processing")),
                        "cart_done": len(Cart.objects.filter(owner_id=request.user.pk, status="done")),
                        "cart_denied": len(Cart.objects.filter(owner_id=request.user.pk, status="denied"))}

        return render(request, "pizza/cart.html", html_content)


def cart_remove(request):
    """Used to remove cart items from Database"""

    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse("login"))

    if request.method == "POST":

        cart_id = str(request.POST["remove_cart"])
        Cart.objects.get(pk=cart_id).delete()

        return JsonResponse({"STATUS": "SUCCESS"})

    return JsonResponse({"STATUS": "FAILED"})


def cart_checkout(request):
    """Used to checkout the cart and add it to the order"""

    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse("login"))

    if request.method == "POST":

        cart_id = int(request.POST["checkout_cart"])
        address = str(request.POST["address"])

        Pizza_order(cart_id=cart_id,
                    address=address,
                    status="waiting").save()

        Cart.objects.filter(pk=cart_id).update(status="processing")

        f = User.objects.get(pk=Cart.objects.get(pk=cart_id).owner_id)

        send_mail("Droid Pizza Order",
                    "Your order is now in process. <br> Cart ID:"+str(cart_id)+" Please do not reply to this email.",
                    os.getenv("EMAIL"),
                    [f.email],
                    fail_silently=False,
                    html_message="<h3>Thank You for checking out.</h3> <br> Your order is now in process. <br> Cart ID:"+str(cart_id)+"<br><small class='text-muted'>Please do not reply to this email</small>")

        return JsonResponse({"STATUS": "SUCCESS"})

    return JsonResponse({"STATUS": "FAILED"})


def pizza_checkout_staff(request):
    """Used to see the pizza's on order (Only Staff can see this page)"""

    if not request.user.is_staff:
        return HttpResponseRedirect(reverse("login"))

    html_content = {"cart_items": len(Cart.objects.filter(owner_id=request.user.pk, status="waiting")),
                    "order": Pizza_order.objects.all(),
                    "order_waiting": len(Pizza_order.objects.filter(status="waiting")),
                    "order_done": len(Pizza_order.objects.filter(status="done")),
                    "order_denied": len(Pizza_order.objects.filter(status="denied"))}

    return render(request, "pizza/pizza_checkout.html", html_content)


def pizzaorder(request, option):
    """Used for the Pizza checkout order page"""

    if request.method == "POST":

        # Check if the user is Staff
        if request.user.is_staff:

            # See which option is being requested
            if option == "vieworder": # Return details of the order

                f = Cart.objects.get(pk=int(Pizza_order.objects.get(pk=int(request.POST["order_id"])).cart_id))

                return JsonResponse({"size": f.size,
                                    "crust": f.crust,
                                    "toppings_n": f.toppings,
                                    "selected_toppings": f.selected_toppings,
                                    "quantity": f.quantity,
                                    "total_value": f.total_value,
                                    "total_value_Q": f.total_value_Q,
                                    "status": f.status})

            elif option == "denie": # Denie the order

                Cart.objects.filter(pk=int(Pizza_order.objects.get(pk=int(request.POST["order_id"])).cart_id)).update(status="denied")
                Pizza_order.objects.filter(pk=int(request.POST["order_id"])).update(status="denied")

                # Get the user's email and send an email
                f = User.objects.get(pk=Cart.objects.get(pk=int(Pizza_order.objects.get(pk=int(request.POST["order_id"])).cart_id)).owner_id)
                send_mail("Droid Pizza Order",
                            "Your order has been Denied. <br> Order ID:"+str(request.POST["order_id"])+" Please do not reply to this email.",
                            os.getenv("EMAIL"),
                            [f.email],
                            fail_silently=False,
                            html_message="<h3>Sorry Something happened with your Order.</h3> <br> Your order has been Denied. <br> Order ID:"+str(request.POST["order_id"])+"<br><small class='text-muted'>Please do not reply to this email</small>")

                return JsonResponse({"STATUS": "SUCCESS"})

            elif option == "done": # Make the order done

                Cart.objects.filter(pk=int(Pizza_order.objects.get(pk=int(request.POST["order_id"])).cart_id)).update(status="done")
                Pizza_order.objects.filter(pk=int(request.POST["order_id"])).update(status="done")

                # Get the user's email and send an email
                f = User.objects.get(pk=Cart.objects.get(pk=int(Pizza_order.objects.get(pk=int(request.POST["order_id"])).cart_id)).owner_id)
                send_mail("Droid Pizza Order",
                            "Your order is Done. <br> Order ID:"+str(request.POST["order_id"])+" Please do not reply to this email.",
                            os.getenv("EMAIL"),
                            [f.email],
                            fail_silently=False,
                            html_message="<h3>Thank You For Buying Pizza With Us.</h3> <br> Your order is Done. <br> Order ID:"+str(request.POST["order_id"])+"<br><small class='text-muted'>Please do not reply to this email</small>")

                return JsonResponse({"STATUS": "SUCCESS"})
        else:
            print("User is not Staff. ERROR: Pizzaorder:1")
    return JsonResponse({"STATUS": "FAILED"})
