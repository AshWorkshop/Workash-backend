from django.shortcuts import render

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from project.wx.serializers import OnLoginSerializer


class OnLoginView(APIView):
    
    def post(self, request, format=None):
        serializer = OnLoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response("success", status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
