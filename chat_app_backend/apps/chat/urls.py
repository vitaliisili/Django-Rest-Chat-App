from django.urls import path, include
from rest_framework import routers
from apps.chat import views

router = routers.DefaultRouter()
router.register('chat-requests', views.ChatRequestViewSet, basename='chat-requests'),
router.register('chat-rooms', views.ChatRoomViewSet, basename='chat-rooms'),

urlpatterns = [
    path('', include(router.urls))
]
