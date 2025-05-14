from django.contrib import admin
from product_management.models import Product

# Register your models here.

class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "product_id",
        "product_name",
        "price",
        "stock",
        "is_new_release",
        "is_trending",
    )
    list_filter = ("is_new_release", "is_trending")
    search_fields = (
        "product_id",
        "product_name",
        "price",
        "detail",
        "description",
    )
admin.site.register(Product, ProductAdmin)

