from rest_framework import serializers
from .models import *

#MARK: User
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('googleid', 'name', 'heartrate', 'spO2', 'age',)


class UserDataSetSerializer(serializers.ModelSerializer):
#     user = UserSerializer(many=False, read_only=True)

    class Meta:
        model = UserDataSet
        fields = ('id', 'user', 'type',)


class DataEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = DataEntry
        fields = ('userdataset', 'value', 'unit', 'date_time',)


class DataTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataType
        fields = ('type',)

#MARK: Goals
class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = ('id', 'user', 'title', 'detail', 'status', 'importance',)
