from rest_framework import serializers
from .models import *

class DataTypeSerializer(serializers.ModelSerializer):
  class Meta:
	model = DataType
	fields = ('type',)