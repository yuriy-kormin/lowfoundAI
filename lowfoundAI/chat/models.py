from django.conf import settings
from django.db import models


class Message(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    request = models.CharField(max_length=30000, null=False, blank=False)
    response = models.CharField(max_length=30000, null=True, blank=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    is_deleted = models.BooleanField(default=False)
