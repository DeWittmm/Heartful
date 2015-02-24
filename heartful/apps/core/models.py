from django.db import models

class DataType(models.Model):
   type = models.CharField(max_length=200)

class DataSet(models.Model):
   title = models.CharField(max_length = 1000)
   research_conclusion = models.CharField(max_length=1000)
   background_info = models.CharField(max_length=1000)
   data_type = models.ForeignKey(DataType)

class HRVariability(DataSet):
   dayToNightR = models.FloatField()
   #5minHRAverage = models.FloatField()

class User(models.Model):
   user_name = models.CharField(max_length=100)
   password = models.CharField(max_length=50)
   personal_data = models.ForeignKey(DataSet)

class Stat(models.Model):
   average = models.IntegerField(default=0)
