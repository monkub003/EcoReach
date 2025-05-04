from django.shortcuts import render
from order_management.models import Order
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from order_management.serializers import OrderSerializer
from django.shortcuts import get_object_or_404

# Create your views here.

class OrderView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, product_id, format=None):
        order = Order.objects.filter(product_id=product_id)
        order_serializer = OrderSerializer(order, many=True)
        content = {
            'data': order_serializer.data
        }
        return Response(content)
