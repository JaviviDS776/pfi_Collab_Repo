from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import UserCreationForm, PasswordResetForm
from .forms import RegistroForm
from django.contrib import messages

def no_cache_decorator(view_func):
    def wrapped_view(request, *args, **kwargs):
        response = view_func(request, *args, **kwargs)
        response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response['Pragma'] = 'no-cache'
        response['Expires'] = '0'
        return response
    return wrapped_view

def home(request):
    return render(request, 'principal/home.html')

def registro(request):
    if request.method == 'POST':
        form = RegistroForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('dashboard')
    else:
        form = RegistroForm()
    return render(request, 'principal/registro.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('dashboard')
    return render(request, 'principal/login.html')

@login_required
@no_cache_decorator
def dashboard(request):
    return render(request, 'principal/dashboard.html')

@login_required
@no_cache_decorator
def pagina1(request):
    return render(request, 'principal/pagina1.html')

@login_required
@no_cache_decorator
def pagina2(request):
    return render(request, 'principal/pagina2.html')

@login_required
@no_cache_decorator
def pagina3(request):
    return render(request, 'principal/pagina3.html')

def password_reset(request):
    if request.method == 'POST':
        form = PasswordResetForm(request.POST)
        if form.is_valid():
            
            return redirect('password_reset_done')
    else:
        form = PasswordResetForm()
    return render(request, 'principal/password_reset.html', {'form': form})

def logout_view(request):
    logout(request)
    messages.success(request, "Has cerrado sesión exitosamente.")
    return redirect('home')