from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
import json

from django.http import Http404, HttpResponseBadRequest, HttpResponse

from .serializers import *
from .heartRateAnalyzer import *

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

class UserTest(APIView):
	def get(self, request, format=None):
		users = User.objects.all()
		serializer = UserSerializer(users, many=True)
		return Response(serializer.data)
	def post(self, request, format=None):
		serializer = UserSerializer(data=request.DATA)
		if serializer.is_valid(raise_exception=True):
			serializer.save()
			return Response(serializer.data, status=status.HTTP_200_OK)
		else:
			return HttpResponse(json.dumps({"user": "2"}), content_type='application/json')

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

class IndexView(APIView):
	def get(self, request, format=None):
		template = loader.get_template("core/index.html")
		c = Context()
		return HttpResponse(template.render(c))

	# form_class = UserRegistrationForm
	# success_url = reverse_lazy("organizations")
