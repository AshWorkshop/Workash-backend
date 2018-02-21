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
