from rest_framework import serializers
from order_management.models import Order


class OrderSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.username")
    product = serializers.CharField(source="product.product_name")

    class Meta:
        model = Order
        fields = ["id", "user", "product", "quantity"]
