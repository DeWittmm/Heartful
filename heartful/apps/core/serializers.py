from rest_framework import serializers
from .models import *


class DataTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataType
        fields = ('type',)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('googleid', 'name', 'heartrate', 'spO2', 'age',)


class UserDataSetSerializer(serializers.ModelSerializer):
#     user = UserSerializer(many=False, read_only=True)

    class Meta:
        model = UserDataSet
        fields = ('user', 'type',)


class DataEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = DataEntry
        fields = ('userdataset', 'value',)
