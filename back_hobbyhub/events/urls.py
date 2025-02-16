from django.urls import path
from .views import *
from django.contrib.auth.views import LogoutView

urlpatterns = [
    # Главные страницы
    path('', guest_page, name=''),
    path('organizer/', organizer_view, name='organizer_view'),
    path('user/', user_view, name='user_view'),

    # Профиль пользователя
    path('user_profile/', user_profile, name='user_profile'),
    path('user_profile/setting/', user_setting, name='user_setting'),
    path("user_profile/update-settings/", update_user_profile, name="update_user_profile"),
    path("user_profile/remove_profile_photo/", remove_user_profile_photo, name="remove_user_profile_photo"),

    path('user_profile/activities/', profile_user_act, name='profile_user_act'),
    path('user_profile/achievements/', user_achievements, name='user_achievements'),
    path('user_profile/setting/language/', user_language, name='user_language'),
    path('user_profile/setting/notification_preferences/', user_notification, name='user_notification'),
    path('user_profile/setting/privacy/', user_privacy, name='user_privacy'),

    # Профиль организатора
    path('organizer_profile/', organizer_profile, name='organizer_profile'),
    path('organizer_profile/settings/', organizer_settings, name='organizer_settings'),
    path("organizer/update-settings/", update_organizer_profile, name="update_organizer_profile"),
    path("organizer/remove_profile_photo/", remove_organizer_profile_photo, name="remove_organizer_profile_photo"),

    # Аутентификацияa
    path('sign_in/', sign_in, name='sign_in'),
    path('sign_up/', sign_up, name='sign_up'),
    path('hobbies/', hobbies, name='hobbies'),
    path('save_hobbies/', save_hobbies, name='save_hobbies'),
    path('logout/', LogoutView.as_view(), name='logout'),  # Встроенный обработчик

    
    # Дополнительные страницы
    path('employees/', employees, name='employees'),
    path('approve_employee/', approve_employee, name='approve_employee'),
    path('deny_employee/', deny_employee, name='deny_employee'),
    path('get_employee_requests/', get_employee_requests, name='get_employee_requests'),

    
    #!!!!! need to update
    path('user_activities/', user_activities, name='user_activities'),
    path('activity_details/', activity_details, name='activity_details'),

]
