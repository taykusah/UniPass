# exeats/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import ExeatRequest, GateActivity
from .serializers import ExeatRequestSerializer, GateActivitySerializer

class ExeatRequestViewSet(viewsets.ModelViewSet):
    serializer_class = ExeatRequestSerializer
    
    def get_queryset(self):
        if self.request.user.role == 'student':
            return ExeatRequest.objects.filter(student=self.request.user)
        return ExeatRequest.objects.all()

    @action(detail=True, methods=['post'])
    def approve_parent(self, request, pk=None):
        exeat = self.get_object()
        exeat.parent_approval = True
        exeat.status = 'pending_dean_approval'
        exeat.save()
        return Response({'status': 'approved'})

    @action(detail=True, methods=['post'])
    def approve_dean(self, request, pk=None):
        exeat = self.get_object()
        exeat.dean_approval = True
        exeat.status = 'approved'
        exeat.save()
        return Response({'status': 'approved'})

class GateActivityViewSet(viewsets.ModelViewSet):
    queryset = GateActivity.objects.all()
    serializer_class = GateActivitySerializer