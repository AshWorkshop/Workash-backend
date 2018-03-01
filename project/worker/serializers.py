from rest_framework import serializers

from project.worker.models import Worker
from project.worker.models import Work
from project.worker.models import Project


class WorkerSerializer(serializers.HyperlinkedModelSerializer):
    wxuser = serializers.HyperlinkedRelatedField(
        read_only=True,
        view_name='wxuser-detail'
    )
    works = serializers.HyperlinkedRelatedField(
        many=True,
        read_only=True,
        view_name='work-detail'
    )
    projects = serializers.HyperlinkedRelatedField(
        many=True,
        read_only=True,
        view_name='project-detail'
    )
    participations = serializers.HyperlinkedRelatedField(
        many=True,
        queryset=Project.objects.all(),
        required=False,
        view_name='project-detail'
    )

    class Meta:
        model = Worker
        fields = ('url', 'wxuser', 'created', 'projects', 'works', 'participations')


class GetWorkerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Worker
        fields = ('url',)


class WorkSerializer(serializers.HyperlinkedModelSerializer):
    worker = serializers.HyperlinkedRelatedField(
        read_only=True,
        view_name='worker-detail'
    )

    class Meta:
        model = Work
        fields = ('url', 'project', 'worker', 'created', 'date', 'name', 'content', 'hours')


class ProjectSerializer(serializers.HyperlinkedModelSerializer):
    manager = serializers.HyperlinkedRelatedField(
        read_only=True,
        view_name='worker-detail'
    )
    actors = serializers.HyperlinkedRelatedField(
        many=True,
        read_only=True,
        view_name='worker-detail'
    )
    works = serializers.HyperlinkedRelatedField(
        many=True,
        read_only=True,
        view_name='work-detail'
    )

    class Meta:
        model = Project
        fields = ('url', 'manager', 'created', 'name', 'detail', 'begin', 'end', 'is_active', 'works', 'actors')
