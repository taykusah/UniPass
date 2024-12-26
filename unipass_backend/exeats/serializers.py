# exeats/serializers.py
from rest_framework import serializers
from .models import ExeatRequest, GateActivity

class ExeatRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExeatRequest
        fields = '__all__'

class GateActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = GateActivity
        fields = '__all__'