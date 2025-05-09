"""
URL configuration for product_service project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from product_management.views import ProductAllView, ProductByIdView, SummarizeView
from order_management.views import OrderView
from user_management.views import UserView, UserProfileView, RegisterView, LoginView
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/profile/', UserProfileView.as_view(), name='profile'),
    path("api/userinfo/<str:username>", UserView.as_view(), name="userinfo"),
    path('api/product/all', ProductAllView.as_view(), name='product_all'),
    path('api/product/byId/<int:product_id>', ProductByIdView.as_view(), name='product_byid'),
    path('api/order/byProductId/<int:product_id>', OrderView.as_view(), name='order'),
    path('api/summarize', SummarizeView.as_view(), name='summarize'),
]
