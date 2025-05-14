from rest_framework import serializers
from user_management.models import CustomerUser


# class CustomerSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Customer
#         fields = ['id', 'user', 'fullname', 'address', 'province', 'post_code', 'tel']

class CustomerUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerUser
        fields = ['id', 'username', 'email', 'created_at', 'wishlist']

class CustomerUserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    
    class Meta:
        model = CustomerUser
        fields = ['username', 'email', 'password', 'confirm_password', 'first_name', 'last_name', 'phone_number']
    
    def validate(self, data):
        # Check if passwords match
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        return data
    
    def create(self, validated_data):
        # Remove confirm_password from validated data
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        
        # Create user using create_user method
        user = CustomerUser.objects.create_user(
            password=password,
            **validated_data
        )
        
        return user

class CustomerUserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'})