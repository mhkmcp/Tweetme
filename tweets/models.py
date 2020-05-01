from django.db import models
from django.conf import settings
import random

User = settings.AUTH_USER_MODEL


class Tweet(models.Model):
    # users can have many tweets, but tweet must have one user
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(blank=True, null=True)
    image = models.FileField(upload_to='images/', blank=True, null=True)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.content

    def serialize(self):
        return {
            'id': self.id,
            'content': self.content,
            'likes': random.randint(0, 15)
        }
