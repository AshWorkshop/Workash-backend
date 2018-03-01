from django.contrib.auth.models import User

from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from project.wx.serializers import UserSerializer
from project.wx.serializers import WxUserSerializer
from project.wx.serializers import WxUserInfoSerializer
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


class WxUserInfoView(BaseView):
    def post(self, request, format=None):
        session = request.auth
        wxuser = request.user.wxuser

        appid = SECRET['appid']
        session_key = session['session_key']
        try:
            encryptedData = request.data['encryptedData']
            iv = request.data['iv']
        except KeyError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        pc = WXBizDataCrypt(appid, session_key)
        data = pc.decrypt(encryptedData, iv)
        print(data)

        serializer = WxUserInfoSerializer(wxuser, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        else:
            print(serializer.errors)
            return Response(status=status.HTTP_400_BAD_REQUEST)
