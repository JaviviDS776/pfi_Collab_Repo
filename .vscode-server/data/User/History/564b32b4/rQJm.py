from django.shortcuts import render

def home(request):
    return render(request, 'principal/index.html')

def rara(request):
    return render(request, 'rara.html')