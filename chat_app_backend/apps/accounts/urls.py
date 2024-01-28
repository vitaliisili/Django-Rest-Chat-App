from django.urls import path, include
from rest_framework import routers
from apps.accounts import views

app_name = 'accounts'

router = routers.DefaultRouter()
router.register('users', views.UserViewSet, basename='users')

urlpatterns = [
    path('', include(router.urls))
]
