# accounts/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    class Roles(models.TextChoices):
        STUDENT = 'student', 'Student'
        ADMIN = 'admin', 'Admin'
        DEAN = 'dean', 'Dean'
        SECURITY = 'security', 'Security'
    
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_set',
        blank=True,
    )
    role = models.CharField(max_length=20, choices=Roles.choices)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=17, blank=True)

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    matric_number = models.CharField(max_length=20, unique=True)
    department = models.CharField(max_length=100)
    level = models.CharField(max_length=20)
    parent_phone = models.CharField(max_length=17)
    parent_email = models.EmailField()

class Staff(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='staff_profile')
    staff_id = models.CharField(max_length=20, unique=True)
    department = models.CharField(max_length=100)
    position = models.CharField(max_length=100)

class SecurityPersonnel(models.Model):
    SHIFT_CHOICES = [
        ('morning', 'Morning'),
        ('afternoon', 'Afternoon'),
        ('night', 'Night'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='security_profile')
    staff_id = models.CharField(max_length=20, unique=True)
    shift = models.CharField(max_length=20, choices=SHIFT_CHOICES)
    post = models.CharField(max_length=100)


# accounts/models.py
# ... previous code ...

class Dean(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='dean_profile')
    staff_id = models.CharField(max_length=20, unique=True)
    department = models.CharField(max_length=100, default='Student Affairs')
    office_location = models.CharField(max_length=100)
    appointment_date = models.DateField()

    class Meta:
        db_table = 'deans'