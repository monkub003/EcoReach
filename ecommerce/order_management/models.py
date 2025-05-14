from django.db import models
from django.core.validators import MinValueValidator, RegexValidator
from product_management.models import Product
from user_management.models import CustomerUser
from django.utils.timezone import now
from decimal import Decimal

# Create your models here.
class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled')
    )
    
    SHIPPING_CHOICES = (
        ('sd', 'Standard Delivery'),         
        ('fd', 'Fast Delivery'),         
        ('pd', 'Premium Delivery')
    )
    
    SHIPPING_COSTS = {
        'sd': Decimal('50.00'),
        'fd': Decimal('80.00'),
        'pd': Decimal('100.00'),
    }
    
    PAYMENT_CHOICES = (
        ('mobile_banking', 'Mobile Banking'),
        ('credit_card', 'Credit Card'),
        ('cod', 'Cash on Delivery')
    )
    
    user = models.ForeignKey(CustomerUser, on_delete=models.CASCADE, null=True, blank=True)
    email = models.EmailField(null=True, blank=False)
    first_name = models.CharField(max_length=50, null=True, blank=False)
    last_name = models.CharField(max_length=50, null=True, blank=False)
    phone_number = models.CharField(
        max_length=15,  # Increased to handle international formats
        null=True, 
        blank=False
    )
    address = models.CharField(max_length=200, null=True, blank=False)
    province = models.CharField(max_length=100, null=True, blank=False)
    district = models.CharField(max_length=100, null=True, blank=False)
    sub_district = models.CharField(max_length=100, null=True, blank=False)
    postal_code = models.CharField(max_length=10, default="00000")  # Changed to CharField for non-numeric postal codes
    note = models.TextField(max_length=300, null=True, blank=True)
    
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    shipping_method = models.CharField(max_length=20, choices=SHIPPING_CHOICES, default='standard')  # Fixed default
    payment_method = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default='credit_card')
    
    created_at = models.DateTimeField(default=now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Order #{self.id} - {self.user.email if self.user else self.email}"
    
    @property
    def items_subtotal(self):
        """Calculate the sum of all order items before shipping and tax"""
        return sum(item.subtotal for item in self.items.all())
    
    @property
    def shipping_cost(self):
        """Get the shipping cost based on the selected shipping method"""
        return self.SHIPPING_COSTS.get(self.shipping_method, Decimal('5.99'))
    
    @property
    def subtotal(self):
        """Calculate the total including shipping"""
        return self.items_subtotal + self.shipping_cost
    
    def save(self, *args, **kwargs):
        """Only save the model without calculating total_amount here"""
        super().save(*args, **kwargs)

    def update_total(self):
        """Update total_amount based on current items and shipping"""
        self.total_amount = self.subtotal
        self.save()


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    product_name = models.CharField(max_length=200)  # Store the product name at time of order
    quantity = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Price at time of order
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    @property
    def subtotal(self):
        return self.price * self.quantity
    
    def __str__(self):
        return f"{self.quantity} x {self.product_name} in Order #{self.order.id}"
    
    def save(self, *args, **kwargs):
        if not self.product_name and self.product:
            self.product_name = self.product.name
        super().save(*args, **kwargs)
        
        # Update the parent order's total amount
        self.order.save()