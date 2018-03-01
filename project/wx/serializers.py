from django.contrib.auth.models import User

from rest_framework import serializers

from project.wx.models import WxUser


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'wxuser')


class WxUserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = WxUser
        fields = ('url', 'user', 'worker', 'nickName', 'avatarUrl', 'gender', 'city', 'province', 'country')


class WxUserInfoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = WxUser
        fields = ('url', 'nickName', 'avatarUrl', 'gender', 'city', 'province', 'country')
