from django.urls import path, include

from rest_framework import routers

from project.worker import views

router = routers.DefaultRouter()
router.register(r'workers', views.WorkerViewSet)
router.register(r'works', views.WorkViewSet)
router.register(r'projects', views.ProjectViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
