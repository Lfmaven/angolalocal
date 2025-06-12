from django.contrib import admin
from django.urls import path, include
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from django.urls import path
from core.views import frontend_view, RegisterView, MeView, current_user
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework_simplejwt.views import TokenVerifyView

schema_view = get_schema_view(
openapi.Info(
    title="API Angola",
    default_version='v1',
    description="Documentação da API de Angola",
),
public=True,
permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('app/', frontend_view, name='login'),
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
    path('api/me/', MeView.as_view(), name='me'),
    path('api/current_user/', current_user, name='current_user'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

