import urllib
from importlib import import_module

from django.utils.six import BytesIO
from django.contrib.auth.models import User
from django.conf import settings

from rest_framework.parsers import JSONParser

from project.wx.secret import SECRET
from project.wx.models import WxUser

def login(code):
    url = r'https://api.weixin.qq.com/sns/jscode2session?'
    query = {
        'appid': SECRET['appid'],
        'secret': SECRET['secret'],
        'grant_type': 'authorization_code'
    }

    query['js_code'] = code
    res = urllib.request.urlopen(
        url + urllib.parse.urlencode(query),
    )
    wxsecret = JSONParser().parse(BytesIO(res.read()))
    # sessionid = binascii.hexlify(os.urandom(16)).decode()
    # print(wxsecret)
    expiry = wxsecret.pop('expires_in')

    sessionStore = import_module(settings.SESSION_ENGINE).SessionStore
    session = sessionStore()
    for k, v in wxsecret.items():
        session[k] = v
    session.set_expiry = expiry
    session.create()

    openid = session['openid']

    user, is_new = User.objects.get_or_create(username=openid)
    if is_new:
        WxUser.objects.create(user=user)

    return (user, session)


def logout(request):
    session = request.auth
    session.flush()
