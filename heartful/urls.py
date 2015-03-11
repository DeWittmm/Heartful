from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView

from apps.core.views import *

#Static
urlpatterns = [
	url(r'^$', TemplateView.as_view(template_name='index.html')),
	url(r'^aboutUs.html/$', TemplateView.as_view(template_name='aboutUs.html'))
]

#Authentications
urlpatterns += [
	url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]

#Test
urlpatterns += [
	url(r'^test/$', httpResponse.as_view(), name='httpTest'),
	url(r'^dataTypes/$', DataTypes.as_view(), name='dataTypes')
]

#Core
urlpatterns += [
	url(r'^user/$', UserTest.as_view(), name='userTest'),
	url(r'^analysis/$', HeartRateInfo.as_view(), name='heartRate'),
	url(r'^dataSet/$', UserDataSetView.as_view(), name='dataSet')
]
