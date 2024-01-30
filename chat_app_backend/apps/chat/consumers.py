import json
import logging
from datetime import datetime, timezone

from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.http import JsonResponse
from django.utils.dateparse import parse_datetime

from apps.chat.models import ChatRoom, Message
from apps.chat.serializers import MessageSerializer

logger = logging.getLogger(__name__)


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        logger.info('::: Connected')
        self.room_name = self.scope["url_route"]["kwargs"]['name']
        self.room_group_name = f"chat_{self.room_name}"
        self.user = self.scope['user']

        logger.info(f'::: USER: {self.user}')
        if self.user.is_authenticated:
            logger.info(f"::: Room Name: {self.room_group_name}")
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()
        else:
            logger.info("::: User is not authenticated")
            await self.disconnect(403)

    async def disconnect(self, close_code):
        logger.info('::: Disconnected')
        self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        message = data['message']
        author = data['author']
        timestamp = data['timestamp']

        chat_room = await database_sync_to_async(ChatRoom.objects.get)(name=self.room_name)  # noqa
        chat_message = Message(content=message,
                               author=self.scope['user'],
                               chat_room=chat_room,
                               created_at=timestamp)

        await database_sync_to_async(chat_message.save)()

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                'author': author,
                'timestamp': timestamp,
            })

    async def chat_message(self, event):
        message = event['message']
        author = event['author']
        timestamp = event['timestamp']

        await self.send(text_data=json.dumps({
            'type': 'message',
            'content': message,
            'author': author,
            'timestamp': timestamp,
        }))
