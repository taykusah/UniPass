# payments/models.py

from django.db import models
from accounts.models import Student
from exeats.models import ExeatRequest

class Penalty(models.Model):
    TYPE_CHOICES = [
        ('overdue', 'Overdue'),
        ('unauthorized_exit', 'Unauthorized Exit'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
    ]
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    exeat_request = models.ForeignKey(ExeatRequest, on_delete=models.CASCADE, null=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'penalties'
        ordering = ['-created_at']

class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('successful', 'Successful'),
        ('failed', 'Failed'),
    ]
    
    penalty = models.ForeignKey(Penalty, on_delete=models.CASCADE)
    transaction_ref = models.CharField(max_length=100, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    payment_method = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'payments'
        ordering = ['-created_at']

# Create your models here.
