from django.contrib import admin
from cart_management.models import Cart, CartItem

# Register your models here.
class CartItemInline(admin.TabularInline):  # or admin.StackedInline
    model = CartItem
    extra = 0

class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'created_at')
    inlines = [CartItemInline]

admin.site.register(Cart, CartAdmin)

