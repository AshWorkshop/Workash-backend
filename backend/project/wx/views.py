import urllib
import binascii
import os

from .secret import SECRET

from django.utils.six import BytesIO

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser

from project.wx.serializers import OnLoginSerializer


class OnLoginView(APIView):
    
    def post(self, request, format=None):
        serializer = OnLoginSerializer(data=request.data)
        url = r'https://api.weixin.qq.com/sns/jscode2session?'
        query = {
            'appid': SECRET['appid'],
            'secret': SECRET['secret'],
            'grant_type': 'authorization_code'
        }
        if serializer.is_valid():
            # print(serializer.data['code'])
            query['js_code'] = serializer.data['code']
            res = urllib.request.urlopen(
                url + urllib.parse.urlencode(query),
            )
            wxsecret = JSONParser().parse(BytesIO(res.read()))
            sessionid = binascii.hexlify(os.urandom(16)).decode()
            request.session[sessionid] = wxsecret['openid'] + wxsecret['session_key']
            request.session.set_expiry(wxsecret['expires_in'])
            print(wxsecret)
            print(sessionid)
            return Response(sessionid, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
