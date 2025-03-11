from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('principal.urls')),  # Enlaza la app principal
    path('rara/', include('principal.urls'))
]
