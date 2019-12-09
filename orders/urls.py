from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("account/", views.account, name="account"),
    path("account/<int:messages>", views.account, name="account_msg"),
    path("account/cpassword", views.account_cpwd, name="account_cpwd"),
    path("add_topping", views.add_topping, name="add_topping"),
    path("add_topping/remove_topping", views.remove_topping, name="remove_topping"),
    path("add_topping/switch_toggle_topping", views.switch_toggle_topping, name="switch_toggle_topping"),
    path("add_topping/new_price", views.new_price, name="new_price"),
    path("build_pizza", views.build_pizza, name="build_pizza"),
    path("build_pizza/topping", views.build_pizza_topping, name="build_pizza_topping"),
    path("cart_page", views.cart_page, name="cart_page"),
    path("cart/remove", views.cart_remove, name="cart_remove"),
    path("cart/checkout", views.cart_checkout, name="cart_checkout"),
    path("check_signup/<slug:check>", views.check_signup, name="check_signup"),
    path("login", views.login_page, name="login"),
    path("logout", views.logout_page, name="logout"),
    path("pizza_checkout_staff", views.pizza_checkout_staff, name="pizza_checkout_staff"),
    path("pizzaorder/<slug:option>", views.pizzaorder, name="pizzaorder"),
    path("register", views.register, name="register")
]
