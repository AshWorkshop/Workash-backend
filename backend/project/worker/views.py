from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response

from project.worker.models import Worker
from project.worker.models import Work
from project.worker.models import Project
from project.worker.serializers import WorkerSerializer
from project.worker.serializers import GetWorkerSerializer
from project.worker.serializers import WorkSerializer
from project.worker.serializers import ProjectSerializer
from project.wx.utils.bases import BaseView


class WorkerViewSet(viewsets.ModelViewSet):
    queryset = Worker.objects.all()
    serializer_class = WorkerSerializer

    def perform_create(self, serializer):
        wxuser = self.request.user.wxuser
        serializer.save(wxuser=wxuser)


class WorkViewSet(viewsets.ModelViewSet):
    queryset = Work.objects.all()
    serializer_class = WorkSerializer

    def perform_create(self, serializer):
        wxuser = self.request.user.wxuser
        worker = wxuser.worker
        serializer.save(worker=worker)


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def perform_create(self, serializer):
        wxuser = self.request.user.wxuser
        manager = wxuser.worker
        serializer.save(manager=manager)


class GetWorkerView(BaseView):
    def get(self, request, format=None):
        wxuser = request.user.wxuser
        if hasattr(wxuser, 'worker'):
            worker = wxuser.worker
            serializer = GetWorkerSerializer(worker, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
