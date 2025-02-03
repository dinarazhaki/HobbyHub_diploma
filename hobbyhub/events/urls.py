from django.urls import path
from events.views import *

urlpatterns = [
    path('guest/',guest_page),
    path('organizer/',organizer_view),
    path('user/',user_view),

]
