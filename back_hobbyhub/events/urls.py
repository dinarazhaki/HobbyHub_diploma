from django.urls import path
from .views import *
from django.contrib.auth.decorators import login_required

urlpatterns = [
    # Главные страницы
    path('guest/', guest_page, name='guest_page'),
    path('organizer/', organizer_view, name='organizer_view'),
    path('user/', user_view, name='user_view'),

    # Профиль пользователя
    path('user_profile/', login_required(user_profile), name='user_profile'),
    path('user_profile/setting/', login_required(user_setting), name='user_setting'),
    path('user_profile/update-settings/', login_required(update_user_profile), name="update_user_profile"),
    path('user_profile/remove_profile_photo/', login_required(remove_user_profile_photo), name="remove_user_profile_photo"),

    path('user_profile/activities/', login_required(profile_user_act), name='profile_user_act'),
    path('user_profile/achievements/', login_required(user_achievements), name='user_achievements'),
    path('user_profile/setting/language/', login_required(user_language), name='user_language'),
    path('user_profile/setting/notification_preferences/', login_required(user_notification), name='user_notification'),
    path('user_profile/setting/privacy/', login_required(user_privacy), name='user_privacy'),

    # Профиль организатора
    path('organizer_profile/', login_required(organizer_profile), name='organizer_profile'),
    path('organizer_profile/settings/', login_required(organizer_settings), name='organizer_settings'),
    path('organizer/update-settings/', login_required(update_organizer_profile), name="update_organizer_profile"),
    path('organizer/remove_profile_photo/', login_required(remove_organizer_profile_photo), name="remove_organizer_profile_photo"),

    # Аутентификацияa
    path('sign_in/', sign_in, name='sign_in'),
    path('sign_up/', sign_up, name='sign_up'),

    # Дополнительные страницы
    path('employees/', employees, name='employees'),
    path('approve_employee/', approve_employee, name='approve_employee'),
    path('deny_employee/', deny_employee, name='deny_employee'),
    path('get_employee_requests/', get_employee_requests, name='get_employee_requests'),
    path('hobbies/', hobbies, name='hobbies'),
    # path('save-hobbies/', save_hobbies, name='save_hobbies'),
]
