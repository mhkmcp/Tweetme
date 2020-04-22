import random
from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, Http404, JsonResponse
from django.utils.http import is_safe_url
from django.conf import settings

from .forms import TweetForm
from .models import Tweet

ALLOWED_HOSTS = settings.ALLOWED_HOSTS


def home_view(request, *args, **kwargs):
    return render(request, 'pages/home.html')


def tweet_create_view(request, *args, **kwargs):
    form = TweetForm(request.POST or None)
    print('post data is: ', request.POST)
    next_url = request.POST.get('next') or None
    print('next_url', next_url)
    if form.is_valid():
        obj = form.save(commit=False)
        obj.save()
        if next_url != None and is_safe_url(next_url, ALLOWED_HOSTS):
            return redirect(next_url)
        form = TweetForm()
    return render(request, 'components/form.html', context={'form': form})


def tweet_list_view(request, *args, **kwargs):
    """
        REST API VIEW
        Consume by JavaScript/Swift/Java/iOS/Android
        return JSON data
    """
    qs = Tweet.objects.all()
    tweet_list = [{'id': x.id, 'content': x.content, "likes": random.randint(0, 12)}
                  for x in qs]
    data = {
        'isUser': False,
        'response': tweet_list
    }
    return JsonResponse(data)


def tweet_detail_view(request, tweet_id, *args, **kwargs):
    print(args)
    print(tweet_id)
    data = {
        'id': tweet_id,
        # 'image': obj.image.url or None
    }
    status = 200
    try:
        obj = Tweet.objects.get(id=tweet_id)
        data['content']: obj.content
    except Exception as ex:
        print(ex)
        data['message'] = 'Not Found!'
        status = 404

    # obj = get_object_or_404(Tweet, id=tweet_id)

    """
        REST API VIEW
        Consume by JavaScript/Swift/Java/iOS/Android
        return JSON data
    """
    # return HttpResponse(obj.content)

    # json.dumps content_type='application/json'
    return JsonResponse(data, status=status)
