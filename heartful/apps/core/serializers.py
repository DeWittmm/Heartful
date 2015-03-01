from rest_framework import serializers
from .models import *

class DataTypeSerializer(serializers.ModelSerializer):
  class Meta:
	model = DataType
	fields = ('type',)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('googleid', 'name', 'heartrate', 'sp02', 'age',)
