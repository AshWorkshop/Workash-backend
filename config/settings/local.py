from .base import *

SECRET_KEY = env(
    'DJANGO_SECRET_KEY',
    default='l7k9_q7v4rnb4ki$ih$l9tu=g(^6q183tncwgm_)!cs3+(uo#i'
)

DEBUG = env.bool('DJANGO_DEBUG', default=True)

ALLOWED_HOSTS = [
    'localhost',
    '192.168.43.93',
    '192.168.0.114',
]

# REST_FRAMEWORK['HIDE_DOCS'] = True
