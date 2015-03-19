import datetime
from django.db import models

#MARK: User
class User(models.Model):
    # TODO?: Migrate DB to use googleid as pk
#   googleid = models.CharField(max_length=100, primary_key=True)
   googleid = models.CharField(max_length=100)
   name = models.CharField(max_length=100)
   heartrate = models.IntegerField(default=0)
   spO2 = models.IntegerField(default=0)
   age = models.IntegerField(default=0)

class UserDataSet(models.Model):
    user = models.ForeignKey(User, unique=False)
    type = models.CharField(max_length=200)

class DataType(models.Model):
  type = models.CharField(max_length=200)

class DataEntry(models.Model):
  userdataset = models.ForeignKey(UserDataSet)
  value = models.FloatField(default=0.0)
  unit = models.CharField(max_length=10, default="bpm")
  date_time = models.DateTimeField(default=datetime.date.today())

#MARK: Goals
class Goal(models.Model):
    user = models.ForeignKey(User, unique=False)
    title = models.CharField(max_length=100)
    detail = models.CharField(max_length=200)
    status = models.CharField(max_length=100)
    importance = models.IntegerField(default=0)

#MARK: Medical
class MedicalDataSet(models.Model):
   title = models.CharField(max_length = 1000)
   research_conclusion = models.CharField(max_length=1000)
   background_info = models.CharField(max_length=1000)
   data_type = models.ForeignKey(DataType)

class StatEntry(models.Model):
   medicaldataset = models.ForeignKey(MedicalDataSet)
   type = models.CharField(max_length=100)
   value = models.IntegerField(default=0)

