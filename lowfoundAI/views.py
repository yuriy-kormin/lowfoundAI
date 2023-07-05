from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.views.generic import CreateView
from lowfoundAI.user.models import User


class RegisterView(CreateView):
    template_name = "base.html"

    def post(self, request, *args, **kwargs):
        username = request.POST.get('username')
        password = request.POST.get('password')
        User.objects.create_user(username=username, password=password)

        return redirect(reverse_lazy('index'))
