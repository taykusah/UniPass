# accounts/serializers.py
from rest_framework import serializers
from .models import User, Student, Staff, SecurityPersonnel

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'phone_number']
        extra_kwargs = {'password': {'write_only': True}}

class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Student
        fields = '__all__'

class StaffSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Staff
        fields = '__all__'

class SecurityPersonnelSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = SecurityPersonnel
        fields = '__all__'