from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer
from product_management.models import Product
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

class OrderProductDetails(APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated access

    def get(self, request, order_id):
        try:
            # Fetch the order with the provided order_id
            order = Order.objects.get(id=order_id)

            # Serialize the order items (products in the order)
            order_items = order.items.all()
            serializer = OrderItemSerializer(order_items, many=True)

            return Response(serializer.data)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=404)

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Order.objects.filter(user=user)
        return Order.objects.none()

    def get_permissions(self):
        if self.action in ['list']:
            self.permission_classes = [AllowAny]
        elif self.action in ['checkout']:
            self.permission_classes = [AllowAny]  # Allow guests to checkout
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()
    
    # def get_permissions(self):
    #     """
    #     Only allow authenticated users to view orders,
    #     but allow anyone to create an order (guest checkout)
    #     """
    #     if self.action in ['list', 'retrieve']:
    #         self.permission_classes = [IsAuthenticated]
    #     return super().get_permissions()
    
    @action(detail=False, methods=['post'])
    def checkout(self, request):
        user = request.user if request.user.is_authenticated else None

        items = request.data.get('items', [])
        if not items:
            return Response({'error': 'No items provided'}, status=400)

        # Validate and create order
        try:
            with transaction.atomic():
                order = Order.objects.create(
                    user=user,
                    email=request.data.get("email"),
                    first_name=request.data.get("first_name"),
                    last_name=request.data.get("last_name"),
                    phone_number=request.data.get("phone_number"),
                    address=request.data.get("address"),
                    province=request.data.get("province"),
                    district=request.data.get("district"),
                    sub_district=request.data.get("sub_district"),
                    postal_code=request.data.get("postal_code"),
                    note=request.data.get("note", ""),
                    shipping_method=request.data.get("shipping_method", "sd"),
                    payment_method=request.data.get("payment_method", "cod"),
                )

                for item in items:
                    product_id = item.get('product_id')
                    quantity = item.get('quantity')

                    if not product_id or not quantity:
                        return Response({'error': 'Invalid item format'}, status=400)

                    product = Product.objects.filter(product_id=product_id).first()
                    if not product:
                        return Response({'error': f'Product with id {product_id} not found'}, status=404)

                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        product_name=product.product_name,
                        quantity=quantity,
                        price=product.price
                    )

                    product.stock -= quantity
                    product.save()

                order.update_total()

                if order.payment_method != "cod":
                    order.status = "paid"
                    order.save()

                serializer = OrderSerializer(order)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=500)



    # @action(detail=False, methods=['post'])
    # def checkout(self, request):
    #     user = request.user if request.user.is_authenticated else None
        
    #     order = Order.objects.create(
    #     user=user,
    #     email=request.data.get("email"),
    #     first_name=request.data.get("first_name"),
    #     last_name=request.data.get("last_name"),
    #     phone_number=request.data.get("phone_number"),
    #     address=request.data.get("address"),
    #     province=request.data.get("province"),
    #     district=request.data.get("district"),
    #     sub_district=request.data.get("sub_district"),
    #     postal_code=request.data.get("postal_code"),
    #     note=request.data.get("note", ""),
    #     shipping_method=request.data.get("shipping_method", "sd"),
    #     payment_method=request.data.get("payment_method", "cod"),
    #     )

    #     order.update_total()

    #     if request.data.get("payment_method") != "cod":
    #         order.status = "paid"
    #         order.save()

    #     items = request.data.get('items', [])
    #     if not items:
    #         return Response({'error': 'No items provided'}, status=400)

    #     for item in items:
    #         product_id = item.get('product_id')
    #         quantity = item.get('quantity')
    #         if not product_id or not quantity:
    #             return Response({'error': 'Invalid item format'}, status=400)
            
    #         product = Product.objects.filter(product_id=product_id).first()
    #         if not product:
    #             return Response({'error': f'Product with id {product_id} not found'}, status=404)

    #         OrderItem.objects.create(
    #             order=order,
    #             product=product,
    #             product_name=product.product_name,
    #             quantity=quantity,
    #             price=product.price
    #         )
    #         product.stock -= quantity
    #         product.save()

    #     serializer = OrderSerializer(order)
    #     return Response(serializer.data, status=status.HTTP_201_CREATED)




    
    # @action(detail=False, methods=['post'])
    # def checkout(self, request):
    #     # Get active cart
    #     user = request.user
    #     if user.is_authenticated:
    #         cart = Cart.objects.filter(user=user, is_active=True).first()
    #     else:
    #         session_id = request.session.session_key
    #         cart = Cart.objects.filter(session_id=session_id, is_active=True).first()
        
    #     if not cart or not cart.items.exists():
    #         return Response(
    #             {'error': 'Your cart is empty'},
    #             status=status.HTTP_400_BAD_REQUEST
    #         )
        
    #     # Validate order data
    #     required_fields = ['full_name', 'email', 'address', 'city', 'postal_code', 
    #                       'country', 'phone', 'payment_method']
        
    #     for field in required_fields:
    #         if not request.data.get(field):
    #             return Response(
    #                 {'error': f'{field} is required'},
    #                 status=status.HTTP_400_BAD_REQUEST
    #             )
        
    #     try:
    #         with transaction.atomic():
    #             # Create order
    #             order = Order.objects.create(
    #                 user=user if user.is_authenticated else None,
    #                 full_name=request.data.get('full_name'),
    #                 email=request.data.get('email'),
    #                 address=request.data.get('address'),
    #                 city=request.data.get('city'),
    #                 postal_code=request.data.get('postal_code'),
    #                 country=request.data.get('country'),
    #                 phone=request.data.get('phone'),
    #                 payment_method=request.data.get('payment_method'),

    #             )
                
    #             # Create order items from cart items
    #             for cart_item in cart.items.all():
    #                 OrderItem.objects.create(
    #                     order=order,
    #                     product=cart_item.product,
    #                     product_name=cart_item.product.name,
    #                     quantity=cart_item.quantity,
    #                     price=cart_item.product.price
    #                 )
                    
    #                 # Update product stock
    #                 product = cart_item.product
    #                 product.stock -= cart_item.quantity
    #                 product.save()
                
    #             # Mark cart as inactive and clear it
    #             cart.is_active = False
    #             cart.save()
                
    #             # Process payment
    #             # This would typically involve calling a payment gateway
    #             # For this example, we'll just mark the order as paid
    #             if request.data.get('payment_method') != 'cod':
    #                 order.status = 'paid'
    #                 order.save()
                
    #             serializer = OrderSerializer(order)
    #             return Response(serializer.data, status=status.HTTP_201_CREATED)
                
    #     except Exception as e:
    #         return Response(
    #             {'error': str(e)},
    #             status=status.HTTP_400_BAD_REQUEST
    #         )

# from django.shortcuts import render
# from order_management.models import Order
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import AllowAny
# from order_management.serializers import OrderSerializer
# from django.shortcuts import get_object_or_404

# # Create your views here.

# class OrderView(APIView):
#     permission_classes = [AllowAny]
#     def get(self, request, product_id, format=None):
#         order = Order.objects.filter(product_id=product_id)
#         order_serializer = OrderSerializer(order, many=True)
#         content = {
#             'data': order_serializer.data
#         }
#         return Response(content)
