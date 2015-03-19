from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase, APIClient

from Heartful.models import DataType

class HeartfulTests(APITestCase):
  def setUp(self):
	  self.data_type = DataType.objects.create("Testing")
	  self.client1 = APIClient()
	  
  def testSetup(self):
	  url = '/dataTypes/'
	  response = self.client1.get(url)
	  self.assertEqual(response.status_code, status.HTTP_200_OK)
	  self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

