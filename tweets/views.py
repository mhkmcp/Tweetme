import random
from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, Http404, JsonResponse
from django.utils.http import is_safe_url
from django.conf import settings

from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated

from .forms import TweetForm
from .models import Tweet
from .serializers import TweetSerializer

ALLOWED_HOSTS = settings.ALLOWED_HOSTS


def home_view(request, *args, **kwargs):
    return render(request, 'pages/home.html')


@api_view(['POST'])
# @authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def tweet_create_view(request, *args, **kwargs):
    serializer = TweetSerializer(data=request.POST)
    if serializer.is_valid(raise_exception=True):
        serializer.save(user=request.user)
        return Response(serializer.data, status=201)

    return Response({}, status=400)


@api_view(['GET'])
def tweet_list_view(request, *args, **kwargs):
    qs = Tweet.objects.all()
    serializer = TweetSerializer(qs, many=True)
    return Response(serializer.data, status=200)


@api_view(['GET'])
def tweet_detail_view(request, tweet_id, *args, **kwargs):
    qs = Tweet.objects.filter(id=tweet_id)
    if not qs.exists():
        return Response({}, status=404)
    obj = qs.first()
    serializer = TweetSerializer(obj)
    return Response(serializer.data, status=200)


@api_view(['DELETE', 'POST'])
@permission_classes([IsAuthenticated])
def tweet_delete_view(request, tweet_id, *args, **kwargs):
    qs = Tweet.objects.filter(id=tweet_id)
    if not qs.exists():
        return Response({}, status=404)
    qs = qs.filter(user=request.user)
    if not qs.exists():
        return Response({'message': 'You cannot delete this tweet'}, status=404)
    obj = qs.first()
    obj.delete()
    return Response({'message': 'Tweet removed'}, status=200)


# pure django views

def tweet_create_view_pure_django(request, *args, **kwargs):
    user = request.user
    if not request.user.is_authenticated:
        user = None
        if request.is_ajax():
            return JsonResponse({}, status=401)
        return redirect(settings.LOGIN_URL)
    form = TweetForm(request.POST or None)
    print('ajax: ', request.is_ajax())
    next_url = request.POST.get('next') or None
    if form.is_valid():
        obj = form.save(commit=False)
        obj.user = user
        obj.save()
        if request.is_ajax():
            # 201 = created status
            return JsonResponse(obj.serialize(), status=201)
        if next_url != None and is_safe_url(next_url, ALLOWED_HOSTS):
            return redirect(next_url)
        form = TweetForm()
    if form.errors:
        if request.is_ajax():
            return JsonResponse(form.errors, status=400)
    return render(request, 'components/form.html', context={'form': form})


def tweet_list_view_pure_django(request, *args, **kwargs):
    """
        REST API VIEW
        Consume by JavaScript/Swift/Java/iOS/Android
        return JSON data
    """
    qs = Tweet.objects.all()
    # tweet_list = [{'id': x.id, 'content': x.content, "likes": random.randint(0, 12)}
    #               for x in qs]
    tweet_list = [x.serialize() for x in qs]
    data = {
        'isUser': False,
        'response': tweet_list
    }
    return JsonResponse(data)


def tweet_detail_view_pure_django(request, tweet_id, *args, **kwargs):
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
