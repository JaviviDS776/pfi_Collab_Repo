from django.shortcuts import render

def home(request):
    return render(request, 'Which_Journal/Which_Journal_App/templates/index.html')
