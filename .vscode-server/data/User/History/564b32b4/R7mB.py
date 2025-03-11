from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib import messages
from .forms import RegisterForm, LoginForm

def home(request):
    return render(request, 'principal/index.html')

def rara(request):
    return render(request, 'principal/rara.html')



def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.info(request, f"Has iniciado sesión como {username}.")
                return redirect('dashboard')
            else:
                messages.error(request, "Nombre de usuario o contraseña inválidos.")
        else:
            messages.error(request, "Nombre de usuario o contraseña inválidos.")
    else:
        form = LoginForm()
    return render(request, 'accounts/login.html', {'form': form})

def register_view(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, "Registro exitoso.")
            return redirect('dashboard')
        messages.error(request, "Registro fallido. Información inválida.")
    else:
        form = RegisterForm()
    return render(request, 'accounts/register.html', {'form': form})

def logout_view(request):
    logout(request)
    messages.info(request, "Has cerrado sesión correctamente.") 
    return redirect('login')

def dashboard_view(request):
    if not request.user.is_authenticated:
        return redirect('login')
    return render(request, 'accounts/dashboard.html')