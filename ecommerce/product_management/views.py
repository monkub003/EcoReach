from django.shortcuts import render
from product_management.models import Product
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from product_management.serializers import ProductSerializer
from user_management.models import CustomerUser
from order_management.models import Order
from django.shortcuts import get_object_or_404
from django.http import JsonResponse

# Create your views here.

class ProductAllView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, format=None):
        product_data = Product.objects.all()
        product_serializer = ProductSerializer(product_data, many=True)
        content = {
            'data': product_serializer.data
        }
        return Response(content)
    
class ProductByIdView(APIView):
    def get(self, request, product_id):
        product = get_object_or_404(Product, product_id=product_id)
        product_serializer = ProductSerializer(product)
        content = {
            'data': product_serializer.data
        }
        return Response(content)

class SummarizeView(APIView):
    def get(self, request):
        summarized_data = {
        "total_users": CustomerUser.objects.count(),
        "total_products": Product.objects.count(),
        "total_orders": Order.objects.count(),
        }
        return JsonResponse(summarized_data)
