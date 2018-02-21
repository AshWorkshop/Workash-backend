from importlib import import_module

from django.conf import settings

from rest_framework.views import APIView


class BaseView(APIView):
    sessionStore = import_module(settings.SESSION_ENGINE).SessionStore
    _session = None

    def get_session_by_session_key(self, session_key=None):
        return self.sessionStore(session_key=session_key)

    def reset_session(self, *args, expiry=0, **datas):
        session = self.get_session_by_session_key()
        for k, v in datas.items():
            session[k] = v
        session.set_expiry = expiry
        session.create()
        self._session = session

    def get_session(self):
        return self._session
