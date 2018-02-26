from django.urls import path, include

from rest_framework import routers

from project.wx import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'wxusers', views.WxUserViewSet)

urlpatterns = [
    path('login/', views.LoginView.as_view()),
    path('wxuserinfo/', views.WxUserInfoView.as_view()),
    path('', include(router.urls)),
]
