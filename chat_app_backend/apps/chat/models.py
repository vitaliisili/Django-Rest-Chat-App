from django.contrib.auth import get_user_model
from django.db import models


class ChatRequest(models.Model):
    INVITING_STATUS = (
        (1, 'waiting'),
        (2, 'accepted'),
        (3, 'declined'),
    )
    sender = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='sent_chat_requests')
    receiver = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='received_chat_requests')
    status = models.SmallIntegerField(choices=INVITING_STATUS, default=1)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)


class ChatRoom(models.Model):
    name = models.CharField(max_length=255)
    members = models.ManyToManyField(get_user_model(), related_name='rooms')
    created_at = models.DateTimeField(auto_now_add=True)
#
#
# class Message(models.Model):
#     # chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, null=True, related_name='messages')
#     author = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
#     content = models.TextField(blank=True, null=True)
#     # image = models.ImageField(blank=True,  null=True, upload_to='image-message')
#     created_at = models.DateTimeField(auto_now_add=True)
#
#     def last_message(self):
#         return Message.objects.order_by('-created_at').all()[:50]
