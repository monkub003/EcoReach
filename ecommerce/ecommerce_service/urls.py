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
from django.urls import path, include
from product_management.views import ProductAllView, ProductByIdView, SummarizeView
from rest_framework.routers import DefaultRouter
from order_management.views import OrderViewSet, OrderProductDetails
from user_management.views import CustomerUserView, CustomerUserProfileView, RegisterView, LoginView, AddToWishlistView, RemoveFromWishlistView, WishlistView

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/profile/', CustomerUserProfileView.as_view(), name='profile'),
    path("api/userinfo/<str:username>", CustomerUserView.as_view(), name="userinfo"),
    path('api/product/all', ProductAllView.as_view(), name='product_all'),
    path('api/product/byId/<int:product_id>', ProductByIdView.as_view(), name='product_byid'),
    path('api/summarize', SummarizeView.as_view(), name='summarize'),
    path('api/', include(router.urls)),
    path('orders/products/<int:order_id>/', OrderProductDetails.as_view(), name='order-product-details'),
    path('wishlist/', WishlistView.as_view(), name='wishlist'),
    path('wishlist/add/<int:product_id>/', AddToWishlistView.as_view(), name='add_to_wishlist'),
    path('wishlist/remove/<int:product_id>/', RemoveFromWishlistView.as_view(), name='remove_from_wishlist'),


    # path('api/order/byProductId/<int:product_id>', OrderView.as_view(), name='order'),
    # path('api/cart/', CartViewSet.as_view({
    #     'get': 'list',
    #     'post': 'create'
    # }), name='cart'),
    # path('api/cart/current/', CartViewSet.as_view({'get': 'current'}), name='cart-current'),
    # path('api/cart/add_item/', CartViewSet.as_view({'post': 'add_item'}), name='cart-add-item'),
    # path('api/cart/update_item/', CartViewSet.as_view({'post': 'update_item'}), name='cart-update-item'),
    # path('api/cart/remove_item/', CartViewSet.as_view({'post': 'remove_item'}), name='cart-remove-item'),
    # path('api/cart/clear/', CartViewSet.as_view({'post': 'clear'}), name='cart-clear'),
]
