from django.contrib.auth.models import User

from rest_framework import serializers

from project.wx.models import WxUser


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url',)
