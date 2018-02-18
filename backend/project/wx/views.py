import urllib
# import binascii
# import os
from importlib import import_module

from .secret import SECRET
from project.wx.utils.WXBizDataCrypt import WXBizDataCrypt

from django.utils.six import BytesIO
from django.conf import settings

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser

from project.wx.serializers import OnLoginSerializer


class OnLoginView(APIView):
    sessionStore = import_module(settings.SESSION_ENGINE).SessionStore  # 使用settings中定义的会话管理器
    
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
            
            session = self.sessionStore()
            session['openid'] = wxsecret['openid']
            session['session_key'] = wxsecret['session_key']
            session.set_expiry(wxsecret['expires_in'])
            session.create()
            sessionid = session.session_key
            
            # if not request.session.session_key:
                # request.session.save()
            # request.session[sessionid] = wxsecret['openid'] + wxsecret['session_key']
            # request.session.set_expiry(wxsecret['expires_in'])
            
            print(session.items())
            print(session.session_key)
            
            return Response(sessionid, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

          
class UserView(APIView):
    sessionStore = import_module(settings.SESSION_ENGINE).SessionStore  # 使用settings中定义的会话管理器
    
    def get(self, request, format=None):
        sessionid = request.META['HTTP_WXSESSION']
        session = self.sessionStore(session_key=sessionid)
        
        appid = SECRET['appid']
        session_key = session['session_key']
        encryptedData = request.GET['encryptedData']
        iv = request.GET['iv']
        
        pc = WXBizDataCrypt(appid, session_key)
        
        print(pc.decrypt(encryptedData, iv))
        
        return Response(status=status.HTTP_200_OK)

          
class TestView(APIView):
    sessionStore = import_module(settings.SESSION_ENGINE).SessionStore  # 使用settings中定义的会话管理器
    
    def get(self, request, format=None):
        sessionid = request.META['HTTP_WXSESSION']
        session = self.sessionStore(session_key=sessionid)
        print(session.items())
        
        return Response(status=status.HTTP_200_OK)