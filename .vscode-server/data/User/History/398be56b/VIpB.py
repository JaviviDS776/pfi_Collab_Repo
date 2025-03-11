# Create your views here.
from django.shortcuts import render

def home(request):
    return render(request, '/home/admin/Which_Journal/Which_Journal_App/templates/index.html')
