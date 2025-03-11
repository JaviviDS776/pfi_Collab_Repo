from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('Which_Journal_App.urls')),  # Enlaza la app principal
]
