from django.db import models
from django.contrib.auth.models import AbstractUser
from django_mongodb_backend.fields import ObjectIdAutoField

class Usuario(AbstractUser):
    id = ObjectIdAutoField(primary_key=True)
    email = models.EmailField(unique=True)
    
    def __str__(self):
        return self.username