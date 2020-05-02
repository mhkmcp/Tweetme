from django.db import models
from django.conf import settings
import random

User = settings.AUTH_USER_MODEL


class TweetLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tweet = models.ForeignKey("Tweet", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username


class Tweet(models.Model):
    parent = models.ForeignKey("self", null=True, on_delete=models.SET_NULL)
    # users can have many tweets, but tweet must have one user
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(blank=True, null=True)
    likes = models.ManyToManyField(
        User, related_name='tweet_user', blank=True, through=TweetLike)
    image = models.FileField(upload_to='images/', blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return str(self.content)

    @property
    def is_retweet(self):
        return self.parent != None

    def serialize(self):
        '''
            No More Needed::Feel Free to Delete
        '''
        return {
            'id': self.id,
            'content': self.content,
            'likes': random.randint(0, 15)
        }
