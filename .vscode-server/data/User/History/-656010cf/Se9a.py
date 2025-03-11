from django.urls import include

urlpatterns = [
    path('', include('tu_app.urls')),  # Reemplaza 'tu_app' con el nombre de tu aplicación
]
