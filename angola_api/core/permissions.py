from rest_framework.permissions import BasePermission, SAFE_METHODS

class ReadOnlyOrAuthenticated(BasePermission):
    """
    Permite acesso irrestrito para métodos de leitura (GET, HEAD, OPTIONS),
    e exige autenticação para escrita (POST, PUT, DELETE).
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated
