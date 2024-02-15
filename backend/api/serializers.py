from rest_framework import serializers
from .models import Item
# temporary
class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'