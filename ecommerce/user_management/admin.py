from django.contrib import admin
from user_management.models import CustomerUser

# Register your models here.

# admin.site.register(Customer)
class CustomerUserAdmin(admin.ModelAdmin):
    list_display = (
        "username",
        "email",
        "first_name",
        "last_name",
        "phone_number",
        "created_at",
    )
    list_filter = ("created_at", )
    search_fields = (
        "username",
        "email",
        "first_name",
        "last_name",
        "phone_number",
        "created_at",
    )
admin.site.register(CustomerUser, CustomerUserAdmin)
