import logging
from io import BytesIO
import matplotlib.pyplot as plt
import randimage
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.utils.crypto import get_random_string
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.accounts.permissions import UserPermission
from apps.accounts.serializers import UserSerializer

logger = logging.getLogger(__name__)


class UserViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    permission_classes = (UserPermission,)

    def create(self, request, *args, **kwargs):
        data = request.data

        image = randimage.get_random_image((100, 100))
        image_bytes = BytesIO()
        plt.imsave(image_bytes, image, format='png')
        filename = get_random_string(length=30) + '.png'
        image_file = ContentFile(image_bytes.getvalue(), name=filename)

        data['image'] = image_file

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False)
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False)
    def contact(self, request):
        email = request.query_params.get('email')

        if not email or email == request.user.email:
            return Response('No valid email provided', status=status.HTTP_400_BAD_REQUEST)

        user = get_user_model().objects.filter(email=email).first()

        if not user:
            return Response('User does not exist', status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
