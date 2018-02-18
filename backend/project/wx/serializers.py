from rest_framework import serializers

class OnLoginSerializer(serializers.Serializer):
    code = serializers.CharField()
    
