from django.contrib.auth.models import User

from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from project.wx.serializers import UserSerializer
from project.wx.serializers import WxUserSerializer
from project.wx.models import WxUser
from project.wx.utils.bases import BaseView
from project.wx.authentication import WxLoginAuthentication
from project.wx.utils.auth import logout
from .secret import SECRET
from project.wx.utils.WXBizDataCrypt import WXBizDataCrypt


class LoginView(BaseView):
    authentication_classes = (WxLoginAuthentication, )

    def post(self, request, format=None):
        return Response(request.auth.session_key, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class WxUserViewSet(viewsets.ModelViewSet):
    queryset = WxUser.objects.all()
    serializer_class = WxUserSerializer


class UserView(BaseView):
    def get(self, request, format=None):
        session = request.auth

        appid = SECRET['appid']
        session_key = session['session_key']
        encryptedData = request.GET['encryptedData']
        iv = request.GET['iv']

        pc = WXBizDataCrypt(appid, session_key)
        data = pc.decrypt(encryptedData, iv)

        serializer = UserSerializer(request.user, context={'request': request})

        return Response(serializer.data, status=status.HTTP_200_OK)
