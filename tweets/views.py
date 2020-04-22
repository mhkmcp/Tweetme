from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, Http404, JsonResponse

from .models import Tweet


def home_view(request, *args, **kwargs):
    return render(request, 'pages/home.html')


def tweet_list_view(request, *args, **kwargs):
    """
        REST API VIEW
        Consume by JavaScript/Swift/Java/iOS/Android
        return JSON data
    """
    qs = Tweet.objects.all()
    tweet_list = [{'id': x.id, 'content': x.content} for x in qs]
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
