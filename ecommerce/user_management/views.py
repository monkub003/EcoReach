from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.contrib.auth.models import User
from user_management.models import User
from user_management.serializers import UserSerializer, UserRegistrationSerializer, UserLoginSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework import status
from django.contrib.auth.hashers import check_password
import jwt
import datetime
from django.conf import settings


class UserView(APIView):
    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        user_data = {
            "username": user.username,
            "email": user.email,
            "created_at": user.created_at.strftime("%d-%m-%Y"),
            'wishlist': list(user.wishlist.values('product_id', 'product_name', 'price')),
        }
        return JsonResponse(user_data)
    
class RegisterView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User registered successfully"},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
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

class UserProfileView(APIView):
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
            user = User.objects.get(id=user_id)
            
            # Use the existing UserSerializer
            serializer = UserSerializer(user)
            return Response(serializer.data)
            
        except jwt.ExpiredSignatureError:
            return Response(
                {"error": "Token expired"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except (jwt.InvalidTokenError, User.DoesNotExist):
            return Response(
                {"error": "Invalid token"},
                status=status.HTTP_401_UNAUTHORIZED
            )

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