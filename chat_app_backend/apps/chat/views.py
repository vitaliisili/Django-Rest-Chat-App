import logging

from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from apps.chat.models import ChatRequest, ChatRoom
from apps.chat.serializers import ChatRequestSerializer, ChatRoomSerializer

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

    def partial_update(self, request, *args, **kwargs):
        logger.info(f"::: Partial update data: {request.data}")
        data = request.data
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)


class ChatRoomViewSet(viewsets.ModelViewSet):
    queryset = ChatRoom.objects.all()  # noqa
    serializer_class = ChatRoomSerializer
    permission_classes = [IsAuthenticated]
