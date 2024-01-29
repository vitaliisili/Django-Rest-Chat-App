from rest_framework import serializers
from apps.accounts.serializers import UserSerializer
from apps.chat.models import ChatRequest, ChatRoom


class ChatRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRequest
        fields = ('id', 'sender', 'receiver', 'status', 'created_at')
        read_only_fields = ('created_at', 'id')

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['sender'] = UserSerializer(instance.sender).data
        representation['receiver'] = UserSerializer(instance.receiver).data
        representation['status'] = dict(ChatRequest.INVITING_STATUS).get(instance.status)
        return representation


class ChatRoomSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True)

    class Meta:
        model = ChatRoom
        fields = ('id', 'name', 'members', 'created_at')
        read_only_fields = ('id', 'created_at')


class ContactChatRoomSerializer(serializers.Serializer):
    chat_name = serializers.CharField(max_length=255, required=True)
    contact_name = serializers.CharField(max_length=255, required=True)
    image = serializers.ImageField(required=False)
