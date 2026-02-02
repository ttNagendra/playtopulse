from django.contrib.auth.models import User
from django.utils.deprecation import MiddlewareMixin


class DevelopmentAuthMiddleware:
    """
    Middleware to automatically authenticate requests with a default user in development.
    This allows testing without implementing full authentication.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # If user is not authenticated, use the first user in the database
        if not request.user.is_authenticated:
            try:
                # Get or create a default user for development
                default_user, created = User.objects.get_or_create(
                    username='default_user',
                    defaults={
                        'email': 'default@example.com',
                        'first_name': 'Default',
                        'last_name': 'User'
                    }
                )
                request.user = default_user
            except Exception as e:
                # If there's any error, just continue with anonymous user
                pass

        response = self.get_response(request)
        return response


class DisableCSRFMiddleware(MiddlewareMixin):
    """
    Middleware to disable CSRF protection for API endpoints in development.
    This is safe for development but should NOT be used in production.
    """
    def process_request(self, request):
        # Disable CSRF for all API endpoints
        if request.path.startswith('/api/'):
            setattr(request, '_dont_enforce_csrf_checks', True)
