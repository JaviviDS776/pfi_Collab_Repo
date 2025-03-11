from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import Usuario

class LoginForm(AuthenticationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'}))

class RegistroForm(UserCreationForm):
    email = forms.EmailField(
        required=True,
        label="Correo electrónico",
        widget=forms.EmailInput(attrs={"placeholder": "Ingresa tu correo", "class": "form-control"}),
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        for field_name, field in self.fields.items():
            field.widget.attrs["class"] = "form-control"

        self.fields["username"].widget.attrs["placeholder"] = "Tu nombre de usuario"
        self.fields["password1"].widget.attrs["placeholder"] = "Crea una contraseña"
        self.fields["password2"].widget.attrs["placeholder"] = "Confirma tu contraseña"

    class Meta:
        model = Usuario
        fields = ("username", "email", "password1", "password2")
        labels = {
            "username": "Nombre de usuario",
            "password1": "Contraseña",
            "password2": "Confirmar contraseña",
        }
