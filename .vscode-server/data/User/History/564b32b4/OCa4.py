from django.shortcuts import render

def home(request):
    return render(request, 'templates/principal/index.html')
