from django.urls import path
from events.views import *

urlpatterns = [
    path('guest/',guest_page),
    path('organizer/',organizer_view),
    path('user/',user_view),
    path('user_profile/',user_profile), #!!!!need to update
    path('user_profile/user_activities/',profile_user_act), #!!!!need to update
    path('user_profile/user_achievements/',user_achievements), #!!!!need to update
    path('user_profile/setting/',user_setting), #!!!!need to update
    path('user_profile/language/',user_language), #!!!!need to update
    path('user_profile/notification_preferences/',user_notification), #!!!!need to update
    path('user_profile/privacy/',user_privacy), #!!!!need to update
    path('organizer_profile/',organizer_profile), #!!!!need to update
    path('organizer_profile/setting/',organizer_setting), #!!!!need to update
    
]
