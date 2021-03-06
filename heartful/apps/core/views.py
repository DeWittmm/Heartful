import json
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import UserDataSet, DataEntry, User
from django.http import Http404, HttpResponseBadRequest, HttpResponse

from .serializers import *
from .heartRateAnalyzer import *
from django.template import loader
from django.template.context import Context
import copy

#MARK: User
class UserTest(APIView):
    
    def get(self, request, format=None):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
    def post(self, request, format=None):
        gid = request.data["googleid"]

        if len(User.objects.filter(googleid=gid)) == 0:
            serializer = UserSerializer(data=request.DATA)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_200_OK)


class UserEntriesView(APIView):

   def get(self, request, format=None):
       enteries = DataEntry.objects.all()
       serializer = DataEntrySerializer(enteries, many=True)

       return Response(serializer.data)

class DataSetEntriesDetailView(APIView):
    
    def get(self, request, pk, format=None):
        userDataSet = get_UserDataSets(pk)
        enteries = DataEntry.objects.filter(userdataset=userDataSet.id)
        serializer = DataEntrySerializer(enteries, many=True)
        
        return Response(serializer.data)

class UserEntriesDetailView(APIView):
    
    def get(self, request, pk, format=None):
        googleid = pk
        user = get_User(googleid)
        userSets = UserDataSet.objects.filter(user=user.id)
        
        enteries = []
        for set in userSets:
            enteries += DataEntry.objects.filter(userdataset=set.id)
        
        serializer = DataEntrySerializer(enteries, many=True)
        return Response(serializer.data)

class UserDataSetView(APIView):

    def get(self, request, format=None):
        sets = UserDataSet.objects.all()
        serializer = UserDataSetSerializer(sets, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        googleid = request.data["googleid"]
        user = get_User(googleid)
        print(str(user.name) + " " + str(user.id))
        activity_type = request.data["type"]
        
        userdataset = UserDataSet.objects.filter(user=user.id, type=activity_type).first()
        if userdataset == None:
            userdatasetserializer = UserDataSetSerializer(data={"user": user.id, "type": activity_type})
            if userdatasetserializer.is_valid(raise_exception=True):
                userdataset = userdatasetserializer.save()
            else:
                userdataset = None
                print("userdatasetserializer not valid")

        if userdataset:
            heartrate_json = request.data["heartrate_values"]
            dict = {"userdataset": userdataset.id}
                        
            multi_data = []
            for heartratedata in heartrate_json:
               dict.update(heartratedata)
               multi_data += [copy.deepcopy(dict)]

            serializer = DataEntrySerializer(data=multi_data, many=True)

            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
                # return HttpResponse(json.dumps({"dataset": userdataset.id}), content_type='application/json', status=status.HTTP_200_OK)

        return HttpResponse(status=status.HTTP_400_BAD_REQUEST, content_type='application/json')

class UserDataSetDetailView(APIView):
    
    def get(self, request, pk, format=None):
        googleid = pk
        user = get_User(googleid)
        userSets = UserDataSet.objects.filter(user=user.id)
        serializer = UserDataSetSerializer(userSets, many=True)
        
        return Response(serializer.data)

#MARK: Goals
class Goals(APIView):
   def get(self, request, format=None):
      goals = Goal.objects.all()
      serializer = GoalSerializer(goals, many=True)

      return Response(serializer.data)

   def post(self, request, format=None):
      googleid = request.data["googleId"]
      user = get_User(googleid)
      request.data["user"] = user.id

      serializer = GoalSerializer(data=request.data)
      if serializer.is_valid(raise_exception=True):
         serializer.save()
         return Response(serializer.data, status=status.HTTP_200_OK)

    #Put request

class GoalsDetails(APIView):
   def get(self, request, pk, format=None):
      user = get_User(pk)
      
      userGoals = Goal.objects.filter(user=user.id)
      serializer = GoalSerializer(userGoals, many=True)
      
      return Response(serializer.data)

#MARK: Info
class DataTypes(APIView):

    def get(self, request, format=None):
        dataTypes = DataType.objects.all()
        serializer = DataTypeSerializer(dataTypes, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = DataTypeSerializer(data=request.DATA)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class HeartRateInfo(APIView):
    def get(self, request, format=None):
        age = int(request.GET.get("age", 0))
        print("Testing age: " + str(age))
        if age <= 0:
            return HttpResponseBadRequest("Invalid Age")

        analyzer = HeartRateAnalyzer()
        max_hr = {"max_hr": analyzer.maxHR(age), "target_hr": analyzer.targetHRZone(age)}
        return HttpResponse(json.dumps(max_hr), content_type='application/json')


class httpResponse(APIView):
    def get(self, request, format=None):
        to_json = {"Test": 1}
        return HttpResponse(json.dumps(to_json), content_type='application/json')

#MARK: Index
class IndexView(APIView):
    def get(self, request, format=None):
        template = loader.get_template("core/index.html")
        c = Context()
        return HttpResponse(template.render(c))

#MARK: Convience Methods
def get_User(pk):
   try:
      obj = User.objects.get(googleid=pk)
      return obj
   except User.DoesNotExist:
      raise Http404

def get_UserDataSets(pk):
   try:
      objs = UserDataSet.objects.get(pk=pk)
      return objs
   except UserDataSet.DoesNotExist:
      raise Http404
