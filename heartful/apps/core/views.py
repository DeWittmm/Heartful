from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
import json

from django.http import Http404, HttpResponseBadRequest, HttpResponse

from .serializers import *

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

