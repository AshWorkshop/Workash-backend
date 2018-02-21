from django.urls import path, include

from project.wx import views


urlpatterns = [
    path('login/', views.LoginView.as_view()),
    path('getuser/', views.UserView.as_view()),
]
