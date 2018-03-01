from django.urls import path, include

from project.nouzan import views

urlpatterns = [
    path('', views.index, name='index'),
]
