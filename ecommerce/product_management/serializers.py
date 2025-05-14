from rest_framework import serializers
from product_management.models import Product


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            "product_id",
            "product_name",
            "price",
            "stock",
            "category",
            "is_new_release",
            "is_trending",
            "rating",
            "description",
            "detail",
            "eco_point",
            "img_url",
        ]
