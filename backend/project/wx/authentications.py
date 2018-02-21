from importlib import import_module

from django.conf import settings
from django.contrib.auth.models import User

from rest_framework import authentication
from rest_framework import exceptions

from .secret import SECRET
from project.wx.utils.WXBizDataCrypt import WXBizDataCrypt
from project.wx.models import WxUser

class WxSessionAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        sessionid = request.META['HTTP_WXSESSION']
        sessionStore = import_module(settings.SESSION_ENGINE).SessionStore
        if not sessionid:
            return None

        session = sessionStore(session_key=sessionid)
        # raise exceptions.AuthenticationFailed('session not exist')
        appid = SECRET['appid']
        session_key = session['session_key']
        encryptedData = request.GET['encryptedData']
        iv = request.GET['iv']

        pc = WXBizDataCrypt(appid, session_key)
        data = pc.decrypt(encryptedData, iv)

        openid = data['openId']

        user, is_new = User.objects.get_or_create(username=openid)
        if is_new:
            WxUser.objects.create(user=user)

        return (user, None)
