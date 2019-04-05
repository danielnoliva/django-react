from django.shortcuts import render
from pages.models import Post
# Create your views here.


def home(request):
    posts = Post.objects.all()

    # title = 'This is the title'
    # for i in range(30):
    #     Post.objects.create(title=title+' '+str(i),
    #                         content='bla bla bla bla bla bla bla')

    template = "home.html"
    context = {
        'posts': posts
    }
    return render(request, template, context)
