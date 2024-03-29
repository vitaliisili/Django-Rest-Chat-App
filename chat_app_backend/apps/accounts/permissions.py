from rest_framework import permissions


class UserPermission(permissions.BasePermission):
    """Custom permission class for user-related actions.
    Methods:
        has_permission: Checks if the user has permission for the requested action.
        has_object_permission: Checks if the user has permission for the requested object action.
    """

    def has_permission(self, request, view):
        """Checks if the user has permission for the requested action.
        Args:
            request (HttpRequest): The request object.
            view (APIView): The view object associated with the action.
        Returns:
            bool: True if the user has permission, False otherwise.
        """

        if view.action == 'list':
            return request.user.is_authenticated and request.user.is_staff
        elif view.action in ['create']:
            return True
        elif view.action == 'destroy':
            return request.user.is_authenticated
        elif view.action in ['retrieve', 'update', 'partial_update', 'me', 'contact']:
            return request.user.is_authenticated
        else:
            return False

    def has_object_permission(self, request, view, obj):
        """Checks if the user has permission for the requested object action.
        Args:
            request (HttpRequest): The request object.
            view (APIView): The view object associated with the action.
            obj: The object related to the action.
        Returns:
            bool: True if the user has permission, False otherwise.
        """

        if not request.user.is_authenticated:
            return False
        if view.action in ['retrieve', 'destroy']:
            return obj == request.user or request.user.is_staff
        elif view.action in ['update', 'partial_update']:
            return obj == request.user or request.user.is_staff
        elif view.action == 'me':
            return obj == request.user
        elif view.action == 'contact':
            return True
        else:
            return False
