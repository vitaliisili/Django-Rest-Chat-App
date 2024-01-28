from django.urls import path, include
from rest_framework import routers

from apps.chat import views

router = routers.DefaultRouter()
router.register('chat-requests', views.ChatRequestViewSet, basename='chat-requests')

urlpatterns = [
    path('', include(router.urls))
]
