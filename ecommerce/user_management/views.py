from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
# from django.contrib.auth.models import User
from user_management.models import CustomerUser
from user_management.serializers import CustomerUserSerializer, CustomerUserRegistrationSerializer, CustomerUserLoginSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework import status
from django.contrib.auth.hashers import check_password
import jwt
import datetime
from django.conf import settings
from product_management.models import Product


class CustomerUserView(APIView):
    def get(self, request, username):
        user = get_object_or_404(CustomerUser, username=username)
        user_data = {
            "username": user.username,
            "email": user.email,
            "created_at": user.created_at.strftime("%d-%m-%Y"),
            'wishlist': list(user.wishlist.values('product_id', 'product_name', 'price')),
        }
        return JsonResponse(user_data)
    
class RegisterView(APIView):
    def post(self, request):
        serializer = CustomerUserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User registered successfully"},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = CustomerUserLoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            
            try:
                user = CustomerUser.objects.get(username=username)
            except CustomerUser.DoesNotExist:
                return Response(
                    {"error": "Invalid credentials"},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Verify password
            if not check_password(password, user.password):
                return Response(
                    {"error": "Invalid credentials"},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Generate JWT token
            payload = {
                'id': user.id,
                'username': user.username,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
            }
            
            token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
            
            return Response(
                {
                    "token": token,
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name
                    }
                },
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomerUserProfileView(APIView):
    def get(self, request):
        # Get auth token from header
        token = request.headers.get('Authorization', '').split(' ')[1]
        
        if not token:
            return Response(
                {"error": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        try:
            # Decode token
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload['id']
            
            # Get user
            user = CustomerUser.objects.get(id=user_id)
            
            # Use the existing UserSerializer
            serializer = CustomerUserSerializer(user)
            return Response(serializer.data)
            
        except jwt.ExpiredSignatureError:
            return Response(
                {"error": "Token expired"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except (jwt.InvalidTokenError, CustomerUser.DoesNotExist):
            return Response(
                {"error": "Invalid token"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
class AddToWishlistView(APIView):
    def post(self, request, product_id):
        token = request.headers.get('Authorization', '').split(' ')[1]
        if not token:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user = CustomerUser.objects.get(id=payload['id'])
            product = get_object_or_404(Product, product_id=product_id)


            user.wishlist.add(product)
            return Response({"message": "Product added to wishlist"}, status=status.HTTP_200_OK)

        except jwt.ExpiredSignatureError:
            return Response({"error": "Token expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)

class RemoveFromWishlistView(APIView):
    def post(self, request, product_id):
        token = request.headers.get('Authorization', '').split(' ')[1]
        if not token:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user = CustomerUser.objects.get(id=payload['id'])
            product = get_object_or_404(Product, product_id=product_id)


            user.wishlist.remove(product)
            return Response({"message": "Product removed from wishlist"}, status=status.HTTP_200_OK)

        except jwt.ExpiredSignatureError:
            return Response({"error": "Token expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)

class WishlistView(APIView):
    def get(self, request):
        token = request.headers.get('Authorization', '').split(' ')[1]
        if not token:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user = CustomerUser.objects.get(id=payload['id'])

            wishlist = user.wishlist.all()

            # 🔍 Debug print — only for development!
            for p in wishlist:
                print("Wishlist item:", p)
                print("Attributes available on product:", dir(p))

            data = [{"product_id": p.product_id, "product_name": p.product_name, "price": p.price, 'img_url': p.img_url} for p in wishlist]

            return Response({"wishlist": data}, status=status.HTTP_200_OK)

        except jwt.ExpiredSignatureError:
            return Response({"error": "Token expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)




# @csrf_exempt
# def register(request):
#     if request.method == "POST":
#         data = JSONParser().parse(request)
#         try:
#             new_user = User.objects.create_user(username=data['username'], password=data['password'])
#         except:
#             return JsonResponse({"error":"username already used."}, status=400)
#         new_user.save()
#         data['user'] = new_user.id
#         customer_serializer = CustomerSerializer(data=data)
#         if customer_serializer.is_valid():
#             customer_serializer.save()
#             return JsonResponse(customer_serializer.data, status=201)
#         new_user.delete()
#         return JsonResponse({"error":"data not valid"}, status=400)
#     return JsonResponse({"error":"method not allowed."}, status=405)

#Create View class after register() view
# class CustomerView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, format=None):
#         customer_data = Customer.objects.get(user=request.user)
#         customer_serializer = CustomerSerializer(customer_data)
#         content = {
#             'data': customer_serializer.data
#         }
#         return Response(content)