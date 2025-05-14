from django.contrib import admin
from order_management.models import Order, OrderItem

# Register your models here.
class OrderItemInline(admin.TabularInline):
    list_display = ('id', 'first_name')
    model = OrderItem
    extra = 0

class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'first_name', 'status', 'created_at')
    inlines = [OrderItemInline]

admin.site.register(Order)