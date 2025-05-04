from django.db import models
from django.contrib.auth.models import User
from product_management.models import Product
# Create your models here.

# class Customer(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     fullname = models.CharField(max_length=255, blank=True)
#     address = models.CharField(max_length=500, blank=True)
#     province = models.CharField(max_length=100, blank=True)
#     post_code = models.CharField(max_length=5, blank=True)
#     tel = models.CharField(max_length=20, blank=True)

class User(models.Model):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    wishlist = models.ManyToManyField(Product, blank=True, related_name='wishlisted_by')
