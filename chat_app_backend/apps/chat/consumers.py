import json
import logging

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

logger = logging.getLogger(__name__)


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        logger.info('::: Connected')
        self.room_name = self.scope["url_route"]["kwargs"]['id']
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
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
            })

    async def chat_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'type': 'message',
            'message': message,
        }))
