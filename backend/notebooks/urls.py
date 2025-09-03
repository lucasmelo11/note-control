from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotebookViewSet, UserViewSet, EmprestimoViewSet

router = DefaultRouter()
router.register(r'notebooks', NotebookViewSet)
router.register(r'users', UserViewSet)
router.register(r'emprestimos', EmprestimoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]