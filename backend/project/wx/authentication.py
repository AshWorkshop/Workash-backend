from importlib import import_module

from django.conf import settings
from django.contrib.auth.models import User

from rest_framework import authentication
from rest_framework import exceptions

from project.wx.utils.auth import login


class WxSessionAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        sessionStore = import_module(settings.SESSION_ENGINE).SessionStore
        sessionid = request.META.get('HTTP_WXSESSION', None)
        if not sessionid:
            return None
        session = sessionStore(session_key=sessionid)
        # raise exceptions.AuthenticationFailed('session not exist')
        try:
            openid = session['openid']
        except KeyError:
            raise exceptions.AuthenticationFailed('session expired')

        try:
            user = User.objects.get(username=openid)
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed('No such user')

        return (user, session)


class WxLoginAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        return login(request.data['code'])
