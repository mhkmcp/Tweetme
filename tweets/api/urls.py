from django.urls import path
# from django.views.generic import TemplateView

from .views import (
    tweet_list_view,
    tweet_create_view,
    tweet_delete_view,
    tweet_detail_view,
    tweet_action_view,
)
'''
CLIENT
Base Endpoint /api/tweets
'''
urlpatterns = [
    path('', tweet_list_view),
    path('create', tweet_create_view),
    path('action', tweet_action_view),
    path('<int:tweet_id>', tweet_detail_view),
    path('<int:tweet_id>/delete', tweet_delete_view),
]
