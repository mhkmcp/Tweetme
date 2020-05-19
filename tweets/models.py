from django.db import models
from django.conf import settings
from django.db.models import Q
import random

User = settings.AUTH_USER_MODEL


class TweetLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tweet = models.ForeignKey("Tweet", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username


class TweetQuerySet(models.QuerySet):
    def by_username(self, username):
        return self.filter(user__username__iexact=username)

    def feed(self, user):
        followed_users_id = []
        profile_exists = user.following.exists()
        # profiles = user.following.all()
        if profile_exists:
            followed_users_id = user.following.values_list(
                "user__id", flat=True)

        return self.filter(
            Q(user__id__in=followed_users_id) |
            Q(user=user)
        ).distinct().order_by("-timestamp")


class TweetManager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        return TweetQuerySet(self.model, using=self._db)

    def feed(self, user):
        return self.get_queryset().feed(user)


class Tweet(models.Model):
    parent = models.ForeignKey("self", null=True, on_delete=models.SET_NULL)
    # users can have many tweets, but tweet must have one user
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="tweets")
    content = models.TextField(blank=True, null=True)
    likes = models.ManyToManyField(
        User, related_name='tweet_user', blank=True, through=TweetLike)
    image = models.FileField(upload_to='images/', blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    objects = TweetManager()

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return str(self.content) + ' ' + str(self.id)

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
