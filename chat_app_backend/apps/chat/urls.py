from django.urls import path, include
from rest_framework import routers
from apps.chat import views

router = routers.DefaultRouter()
router.register('chat-requests', views.ChatRequestViewSet, basename='chat-requests'),
router.register('chat-rooms', views.ChatRoomViewSet, basename='chat-rooms'),
router.register('messages', views.MessagesViewSet, basename='messages'),

urlpatterns = [
    path('', include(router.urls))
]
