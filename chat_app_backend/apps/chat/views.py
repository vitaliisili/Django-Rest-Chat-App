import logging
import uuid
from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from apps.chat.models import ChatRequest, ChatRoom, Message
from apps.chat.serializers import (
    ChatRequestSerializer,
    ChatRoomSerializer,
    ContactChatRoomSerializer,
    MessageSerializer
)

logger = logging.getLogger(__name__)


class ChatRequestViewSet(viewsets.ModelViewSet):
    queryset = ChatRequest.objects.all()  # noqa
    serializer_class = ChatRequestSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        queryset = ChatRequest.objects.filter(Q(sender=self.request.user.id) | Q(receiver=self.request.user.id))  # noqa
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        email = request.data.get('email')
        logger.info(f'::: Receiver email: {email}')
        if not email:
            return Response({"message": "Please provide email"}, status=status.HTTP_400_BAD_REQUEST)

        receiver = get_user_model().objects.filter(email=email).first()
        if not receiver:
            return Response({"message": "User not found please insert valid email"}, status=status.HTTP_404_NOT_FOUND)

        check_invitation = ChatRequest.objects.filter(  # noqa
            Q(sender=request.user, receiver=receiver) | Q(sender=receiver, receiver=request.user)).exists()

        if check_invitation:
            return Response({"message": "Invitation already exist between contacts"},
                            status=status.HTTP_400_BAD_REQUEST)

        data = {
            'sender': request.user.id,
            'receiver': receiver.id,
            'status': 1
        }

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=['PATCH'], detail=True, url_path='accept-invitation')
    def accept_invitation(self, request, pk=None):

        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        chat_room = ChatRoom(name=uuid.uuid4())
        chat_room.save()

        chat_room.members.set([instance.sender, instance.receiver])
        chat_room.save()

        return Response({"message": "Invite accepted"}, status=status.HTTP_200_OK)


class ChatRoomViewSet(viewsets.ModelViewSet):
    queryset = ChatRoom.objects.all()  # noqa
    serializer_class = ChatRoomSerializer
    permission_classes = [IsAuthenticated]

    @action(methods=['GET'], detail=False, url_path='contacts')
    def get_contacts(self, request):
        logger.info(f"Query filter: {request.query_params.get('name')}")

        filter_name = request.query_params.get('name')
        try:
            queryset = ChatRoom.objects.filter(members__id=request.user.id)  # noqa
            data = [
                {
                    "contact_name":
                        chat.members.all()[1].get_full_name() if
                        chat.members.all()[0].id == request.user.id else
                        chat.members.all()[0].get_full_name(),
                    "image":
                        chat.members.all()[1].image if
                        chat.members.all()[0].id == request.user.id else
                        chat.members.all()[0].image,
                    "chat_name": chat.name,
                } for chat in queryset
            ]

            if filter_name:
                data = list(filter(lambda contact: filter_name.lower() in contact.get('contact_name').lower(), data))

            serializer = ContactChatRoomSerializer(data=data, many=True)
            serializer.is_valid(raise_exception=True)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class MessagesViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()  # noqa
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    @action(methods=['get'], detail=False, url_path='get-room-messages')
    def get_room_messages(self, request):
        room_name = request.query_params.get('room-name')
        query_set = Message.objects.filter(chat_room__name=room_name)  # noqa
        serializer = self.get_serializer(query_set, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
