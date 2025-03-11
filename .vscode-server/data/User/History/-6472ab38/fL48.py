from django.urls import path
from .views import home, rara

urlpatterns = [
    path('', home, name='home'),
    path('', rara)
]
