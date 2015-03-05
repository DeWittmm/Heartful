from django.db import models

class User(models.Model):
   googleid = models.CharField(max_length=100, unique=True)
   name = models.CharField(max_length=100)
   heartrate = models.IntegerField(default=0)
   spO2 = models.IntegerField(default=0)
   age = models.IntegerField(default=0)

class DataType(models.Model):
  type = models.CharField(max_length=200)

class UserDataSet(models.Model):
  user = models.ForeignKey(User, unique=False)
  type = models.CharField(max_length=100)

class DataEntry(models.Model):
  userdataset = models.ForeignKey(UserDataSet)
  value = models.FloatField(default=0.0)

class MedicalDataSet(models.Model):
   title = models.CharField(max_length = 1000)
   research_conclusion = models.CharField(max_length=1000)
   background_info = models.CharField(max_length=1000)
   data_type = models.ForeignKey(DataType)

class StatEntry(models.Model):
   medicaldataset = models.ForeignKey(MedicalDataSet)
   type = models.CharField(max_length=100)
   value = models.IntegerField(default=0)
