from django.urls import path, include

from project.wx import views


urlpatterns = [
    path('onlogin/', views.OnLoginView.as_view()),
]
