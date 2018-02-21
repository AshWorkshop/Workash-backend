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


class Work(models.Model):
    """
    工作信息
    """
    manager = models.ForeignKey(
        Worker,
        related_name='manages',
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
