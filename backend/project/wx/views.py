import urllib
# import binascii
# import os

from .secret import SECRET
from project.wx.utils.WXBizDataCrypt import WXBizDataCrypt

from django.utils.six import BytesIO

from rest_framework import status
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated

from project.wx.serializers import OnLoginSerializer
from project.wx.utils.bases import BaseView
from project.wx.authentications import WxSessionAuthentication


class OnLoginView(BaseView):
    def post(self, request, format=None):
        serializer = OnLoginSerializer(data=request.data)
        url = r'https://api.weixin.qq.com/sns/jscode2session?'
        query = {
            'appid': SECRET['appid'],
            'secret': SECRET['secret'],
            'grant_type': 'authorization_code'
        }
        if serializer.is_valid():
            query['js_code'] = serializer.data['code']
            res = urllib.request.urlopen(
                url + urllib.parse.urlencode(query),
            )
            wxsecret = JSONParser().parse(BytesIO(res.read()))
            # sessionid = binascii.hexlify(os.urandom(16)).decode()
            expiry = wxsecret.pop('expires_in')
            self.reset_session(expiry=expiry, **wxsecret)
            session = self.get_session()
            sessionid = session.session_key

            print(session.items())
            print(session.session_key)

            return Response(sessionid, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class UserView(BaseView):
    authentication_classes = (WxSessionAuthentication, )
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        print(request.user.username)

        return Response(status=status.HTTP_200_OK)
