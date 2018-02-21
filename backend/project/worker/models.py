from django.db import models
from project.wx.models import WxUser

class Worker(models.Model):
    """
    工人信息
    """
    wxuser = models.OneToOneField(
        WxUser,
        related_name='worker',
        on_delete=models.CASCADE
    )
    created = models.DateTimeField(auto_now_add=True)
    participations = models.ManyToManyField(
        'worker.Project',
        related_name='actors'
    )


class Project(models.Model):
    """
    工作项目信息
    """
    manager = models.ForeignKey(
        Worker,
        related_name='projects',
        on_delete=models.CASCADE
    )
    created = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=100)
    detail = models.CharField(max_length=400, blank=True)
    begin = models.DateField()
    end = models.DateField()


class Work(models.Model):
    """
    工作信息
    """
    project = models.ForeignKey(
        Project,
        related_name='works',
        on_delete=models.CASCADE
    )
    worker = models.ForeignKey(
        Worker,
        related_name='works',
        on_delete=models.CASCADE
    )
    created = models.DateTimeField(auto_now_add=True)
    date = models.DateField()
    name = models.CharField(max_length=100)
    content = models.CharField(max_length=400, blank=True)
    hours = models.FloatField(default=0.0)
