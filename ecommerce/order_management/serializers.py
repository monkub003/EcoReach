from rest_framework import serializers
from .models import Order, OrderItem
from product_management.serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True, required=False)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = OrderItem
        fields = [
            'id', 'order', 'product_id', 'product', 'product_name',
            'quantity', 'price', 'subtotal', 'created_at'
        ]
        read_only_fields = ['order', 'product_name', 'price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    grand_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    
    class Meta:
        model = Order
        fields = [
            'id', 'user',  'email', 'first_name', 'last_name',  'phone_number', 'address', 
            'province', 'district', 'sub_district', 'postal_code','subtotal', 'note',
            'total_amount', 'status', 'shipping_method','payment_method', 'created_at',
            'items', 'grand_total', 'subtotal'
        ]
        read_only_fields = ['user', 'total_amount']



# from order_management.models import Order


# class OrderSerializer(serializers.ModelSerializer):
#     user = serializers.CharField(source="user.username")
#     product = serializers.CharField(source="product.product_name")

#     class Meta:
#         model = Order
#         fields = ["id", "user", "product", "quantity"]
