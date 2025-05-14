# cart/views.py (Django Backend)
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from product_management.models import Product
from django.db.models import F

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Cart.objects.filter(user=user, is_active=True)
        else:
            # For guest users, use cart_id from session
            cart_id = self.request.session.get('cart_id')
            if cart_id:
                return Cart.objects.filter(id=cart_id, is_active=True)
            return Cart.objects.none()
    
    def get_or_create_cart(self):
        user = self.request.user
        if user.is_authenticated:
            cart, created = Cart.objects.get_or_create(
                user=user,
                is_active=True
            )
        else:
            # For guest users
            cart_id = self.request.session.get('cart_id')
            if cart_id:
                try:
                    cart = Cart.objects.get(id=cart_id, is_active=True)
                except Cart.DoesNotExist:
                    cart = Cart.objects.create()
            else:
                cart = Cart.objects.create()
            self.request.session['cart_id'] = cart.id
        return cart
    
    @action(detail=False, methods=['GET'])
    def current(self, request):
        cart = self.get_or_create_cart()
        serializer = self.get_serializer(cart)
        return Response(serializer.data)
    
    @action(detail=False, methods=['POST'])
    def add_item(self, request):
        cart = self.get_or_create_cart()
        
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response(
                {"error": "Product not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )
        
        if not created:
            # Update existing cart item quantity
            cart_item.quantity = F('quantity') + quantity
            cart_item.save()
            cart_item.refresh_from_db()  # Refresh to get the updated value
        
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    
    @action(detail=False, methods=['POST'])
    def remove_item(self, request):
        cart = self.get_or_create_cart()
        
        item_id = request.data.get('item_id')
        
        try:
            cart_item = CartItem.objects.get(id=item_id, cart=cart)
            cart_item.delete()
            
            serializer = CartSerializer(cart)
            return Response(serializer.data)
        except CartItem.DoesNotExist:
            return Response(
                {"error": "Item not found in cart"}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['POST'])
    def update_quantity(self, request):
        cart = self.get_or_create_cart()
        
        item_id = request.data.get('item_id')
        quantity = int(request.data.get('quantity', 1))
        
        if quantity < 1:
            return Response(
                {"error": "Quantity must be at least 1"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            cart_item = CartItem.objects.get(id=item_id, cart=cart)
            cart_item.quantity = quantity
            cart_item.save()
            
            serializer = CartSerializer(cart)
            return Response(serializer.data)
        except CartItem.DoesNotExist:
            return Response(
                {"error": "Item not found in cart"}, 
                status=status.HTTP_404_NOT_FOUND
            )

# Add URLs to your Django urls.py file:
# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from cart.views import CartViewSet
#
# router = DefaultRouter()
# router.register(r'carts', CartViewSet, basename='cart')
#
# urlpatterns = [
#     path('api/', include(router.urls)),
# ]