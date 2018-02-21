from rest_framework.views import APIView


class BaseView(APIView):
    def get_session(self):
        return self.request.auth
