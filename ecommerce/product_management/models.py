from django.db import models

# Create your models here.


class Product(models.Model):
    product_id = models.CharField(max_length=20, primary_key=True, blank=True, unique=True)
    product_name = models.CharField(max_length=255, null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=1)
    category = models.CharField(max_length=100, null=True, blank=True)
    is_new_release = models.BooleanField(default=False)
    is_trending = models.BooleanField(default=False)
    rating = models.CharField(max_length=1, choices=[('0', '0'), ('1', '1'), ('2', '2'), ('3', '3'), ('4', '4'), ('5', '5')], default='0')
    description = models.TextField(max_length=300, null=True, blank=True)
    detail = models.TextField(max_length=300, null=True, blank=True)
    eco_point = models.DecimalField(max_digits=3, decimal_places=0, default=0)
    img_url = models.URLField(max_length=500, blank=True, null=True)


