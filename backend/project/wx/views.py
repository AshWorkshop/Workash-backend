from .secret import SECRET
from project.wx.utils.WXBizDataCrypt import WXBizDataCrypt

from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from project.wx.serializers import OnLoginSerializer
from project.wx.utils.bases import BaseView
from project.wx.authentications import WxSessionAuthentication
from project.wx.authentications import WxLoginAuthentication
from project.wx.utils.auth import logout


class LoginView(BaseView):
    authentication_classes = (WxLoginAuthentication, )
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        return Response(request.auth.session_key, status=status.HTTP_200_OK)


class UserView(BaseView):
    authentication_classes = (WxSessionAuthentication, )
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        session = request.auth

        appid = SECRET['appid']
        session_key = session['session_key']
        encryptedData = request.GET['encryptedData']
        iv = request.GET['iv']

        pc = WXBizDataCrypt(appid, session_key)
        data = pc.decrypt(encryptedData, iv)

        print(request.user.username)
        return Response(status=status.HTTP_200_OK)
