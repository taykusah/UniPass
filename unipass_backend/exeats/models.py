from django.db import models
from django.conf import settings
import qrcode
from io import BytesIO
from django.core.files import File
from PIL import Image, ImageDraw
from accounts.models import SecurityPersonnel

class ExeatRequest(models.Model):
    STATUS_CHOICES = [
        ('pending_parent_approval', 'Pending Parent Approval'),
        ('pending_dean_approval', 'Pending Dean Approval'),
        ('approved', 'Approved'),
        ('denied', 'Denied'),
        ('completed', 'Completed'),
        ('overdue', 'Overdue'),
    ]
    
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    reason = models.TextField()
    departure_date = models.DateField()
    departure_time = models.TimeField()
    return_date = models.DateField()
    return_time = models.TimeField()
    parent_number = models.CharField(max_length=17)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='pending_parent_approval')
    parent_approval = models.BooleanField(default=False)
    dean_approval = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    qr_code = models.ImageField(upload_to='qr_codes/', null=True, blank=True)

class GateActivity(models.Model):
    ACTIVITY_TYPES = [
        ('entry', 'Entry'),
        ('exit', 'Exit'),
    ]
    
    STATUS_CHOICES = [
        ('valid', 'Valid'),
        ('invalid', 'Invalid'),
        ('overdue', 'Overdue'),
    ]
    
    exeat_request = models.ForeignKey(ExeatRequest, on_delete=models.CASCADE)
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    security_personnel = models.ForeignKey(SecurityPersonnel, on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=10, choices=ACTIVITY_TYPES)
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    notes = models.TextField(blank=True, null=True)

    def generate_qr_code(self):
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        
        data = {
            'exeat_id': str(self.id),
            'student_name': self.student.name,
            'matric_number': self.student.matricNumber,
            'departure': f"{self.departure_date} {self.departure_time}",
            'return': f"{self.return_date} {self.return_time}"
        }
        
        qr.add_data(str(data))
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        blob = BytesIO()
        img.save(blob, 'PNG')
        self.qr_code.save(f'qr_code_{self.id}.png', File(blob), save=False)

    def save(self, *args, **kwargs):
        if self.status == 'approved' and not self.qr_code:
            self.generate_qr_code()
        super().save(*args, **kwargs)