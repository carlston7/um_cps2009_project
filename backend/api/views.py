from django.shortcuts import render

# temporary

from rest_framework import viewsets
from .models import Item
from .serializers import ItemSerializer
from django.http import HttpResponse

def home(request):
    return HttpResponse('Hello, this is the API root.')
    
class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

