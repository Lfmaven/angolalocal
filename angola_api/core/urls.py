from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import ProvinciaViewSet, MunicipioViewSet, ComunaViewSet, RegisterView, MeView

router = DefaultRouter()
router.register(r'provincias', ProvinciaViewSet)
router.register(r'municipios', MunicipioViewSet)
router.register(r'comunas', ComunaViewSet)

urlpatterns = router.urls
