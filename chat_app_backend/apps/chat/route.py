from django.urls import path
from apps.chat import consumers

websocket_urlpatterns = [
    path('ws/chat/<uuid:name>', consumers.ChatConsumer.as_asgi())
]