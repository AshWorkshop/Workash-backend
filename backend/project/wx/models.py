from django.db import models

class WxUser(models.Model):
    """
    微信用户信息
    """
    user = models.OneToOneField(
        'auth.User',
        related_name='wxuser',
        on_delete=models.CASCADE
    )
    # unionid = models.CharField(max_length=100)
    nickName = models.CharField(max_length=100, default="Unknown")
    avatarUrl = models.URLField(default="http://unknown.unkown/")
    gender = models.IntegerField(default=0)
    city = models.CharField(max_length=100, default="Unknown")
    province = models.CharField(max_length=100, default="Unknown")
    country = models.CharField(max_length=100, default="Unknown")
