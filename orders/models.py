from django.db import models

# Create your models here.

# Used for available Pizza list
class Pizza(models.Model):
	name = models.CharField(max_length=64, null=False)
	img = models.CharField(max_length=600, default="pizza/img/")
	available = models.CharField(max_length=64, default="YES")
	topping = models.IntegerField(null=False, default=0)
	ingredients = models.CharField(max_length=900, default="")
	price = models.IntegerField(default=0)

	def __str__(self):
		return f"Pizza: {self.name} Image: {self.img} Available: {self.available} Topping: {self.topping} Ingredients: {self.ingredients} Price: {self.price}"

# Used for pizza orders
class Pizza_order(models.Model):
	cart_id = models.IntegerField(null=False, default=0, unique=True)
	address = models.CharField(max_length=900, null=False, default="NO_ADDRESS")
	status = models.CharField(max_length=32, default="waiting")
	ordered_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"Cart ID: {self.cart_id} Address: {self.address} Status: {self.status} Ordered At: {self.ordered_at}"

# Used to keep track of user's carts
class Cart(models.Model):
	owner_id = models.IntegerField(null=False)
	size = models.CharField(max_length=12, null=False)
	crust = models.CharField(max_length=12, null=False)
	toppings = models.IntegerField(null=False)
	selected_toppings = models.CharField(max_length=90, null=False)
	quantity = models.IntegerField(null=False, default=0)
	total_value = models.IntegerField(null=False)
	total_value_Q = models.IntegerField(null=False, default=0)
	status = models.CharField(max_length=64, null=False, default="waiting")
	added_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"Owner ID: {self.owner_id} Pizza Size: {self.size} Pizza Crust: {self.crust} Pizza Toppings: {self.toppings} Pizza Selected Toppings: {self.selected_toppings} Quantity: {self.quantity} Total Value: {self.total_value} Total Quantity Value: {self.total_value_Q} Status: {self.status} Added At: {self.added_at}"

# Used to keep track of what toppings are in the system
class Topping(models.Model):
	name = models.CharField(null=False, unique=True, max_length=200)
	price = models.IntegerField(null=False)
	image = models.ImageField(upload_to="topping_img/", help_text="Topping Image")
	available = models.CharField(max_length=3, default="ON")

	def __str__(self):
		return f"Topping Name: {self.name} Price: {self.price} Image: {self.image} Available: {self.available}"
