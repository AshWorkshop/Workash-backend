import urllib

from .secret import SECRET

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

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
            print(res.read())
            return Response(res.read(), status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
