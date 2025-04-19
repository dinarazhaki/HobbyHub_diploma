from django.utils.deprecation import MiddlewareMixin

class SessionControlMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.path == "/sign_in/" and request.method == "POST":
            if request.session.get("company_id") or request.session.get("nickname"):
                request.session.flush()  