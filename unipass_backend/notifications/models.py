# notifications/models.py

from django.db import models
from accounts.models import User

class Notification(models.Model):
    TYPE_CHOICES = [
        ('exeat_request', 'Exeat Request'),
        ('parent_approval', 'Parent Approval'),
        ('dean_approval', 'Dean Approval'),
        ('return_reminder', 'Return Reminder'),
        ('overdue_alert', 'Overdue Alert'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    message = models.TextField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']

class NotificationLog(models.Model):
    notification = models.ForeignKey(Notification, on_delete=models.CASCADE)
    sent_via = models.CharField(max_length=20)  # email, sms, etc.
    status = models.CharField(max_length=20)
    sent_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'notification_logs'

# Create your models here.
