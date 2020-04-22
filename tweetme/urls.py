from django.contrib import admin
from django.urls import path, re_path  # url()

from tweets.views import home_view, tweet_detail_view

urlpatterns = [
    path('', home_view),
    path('tweets/<int:tweet_id>/', tweet_detail_view),

    path('admin/', admin.site.urls),
]
