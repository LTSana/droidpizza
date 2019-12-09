from django.contrib import admin

from .models import Pizza, Pizza_order, Cart, Topping

# Register your models here.
admin.site.register(Pizza)
admin.site.register(Pizza_order)
admin.site.register(Cart)
admin.site.register(Topping)