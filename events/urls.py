from django.urls import path, include
from .views import *
from django.contrib.auth.views import LogoutView


urlpatterns = [
    path('social-auth/', include('social_django.urls')),

    # Главные страницы
    path('', guest_page, name=''),
    path('organizer/', organizer_view, name='organizer_view'),
    path('user/', user_view, name='user_view'),
    path('guest_faq/',guest_faq, name='guest_faq'),
    path('guest_support/', guest_support, name='guest_support'),
    path('guest_service/', guest_service, name='guest_service'),
    path('become_partner/', become_partner, name='become_partner'),
    path('forgot-password/', forgot_password, name='forgot_password'),
    path('reset/<uidb64>/<token>/', reset_password, name='reset_password'),

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
    path('user_profile/setting/privacy/update_password/', update_user_password, name='update_user_password'),
    
    path("get_notifications/", get_notifications, name="get_notifications"),
    path('user_activities/', user_activities, name='user_activities'),
    path('activity/<int:event_id>/', activity_details, name='activity_details'),
    path('apply_to_event/<int:event_id>/', apply_to_event, name='apply_to_event'),
    path('cancel_event_registration/<int:event_id>/', cancel_event_registration, name='cancel_event_registration'),
    path('leaderboard/', leaderboard, name="leaderboard"),
    path('leaderboard_show/', leaderboard_show, name="leaderboard_show"),
    path('challenges/', challenges, name='challenges'),
    
    path('get_notifications/', get_notifications, name='get_notifications'),
    path('mark_notification_as_read/', mark_notification_as_read, name='mark_notification_as_read'),

    # Профиль организатора
    path('organizer_profile/', organizer_profile, name='organizer_profile'),
    path('organizer_profile/settings/', organizer_settings, name='organizer_settings'),
    path("organizer/update-settings/", update_organizer_profile, name="update_organizer_profile"),
    path("organizer/remove_profile_photo/", remove_organizer_profile_photo, name="remove_organizer_profile_photo"),
    path('organizer_profile/setting/language/', organizer_language, name='organizer_language'),
    path('organizer_profile/setting/notification_preferences/', organizer_notification, name='organizer_notification'),
    
    path('organizer_profile/setting/privacy/', organizer_privacy, name='organizer_privacy'),
    path('organizer_profile/setting/privacy/change-password/', update_organizer_password, name='organizer_update_password'),


    path('activities/', organizer_activities, name='activities'),
    path('create_event/', create_event, name='create_event'),
    path('delete_event/<int:event_id>/', delete_event, name='delete_event'),
    path('get_event_details/<int:event_id>/', get_event_details, name='get_event_details'),
    path('edit_event/<int:event_id>/', edit_event, name='edit_event'),
    path('leaderboard_show/', leaderboard_show, name='leaderboard_show'),
    path('add_prize/', add_prize, name='add_prize'),
    path('edit_prize/<int:prize_id>/', edit_prize, name='edit_prize'),
    path('delete_prize/<int:prize_id>/', delete_prize, name='delete_prize'),
    path('profile_lookup/', profile_lookup, name='profile_lookup'),
    path('organizer_profile_lookup/', organizer_profile_lookup, name='organizer_profile_lookup'),
    path('organizer_activity_details/', organizer_activity_details, name='organizer_activity_details'),
    path('faq/', faq, name='faq'),
    path('contact_support/', contact_support, name='contact_support'),
    path('terms_of_service/', terms_of_service, name="terms_of_service"),
    path('org_faq/', org_faq, name='org_faq'),
    path('org_contact_support/', org_contact_support, name='org_contact_support'),
    path('org_terms_of_service/', org_terms_of_service, name="org_terms_of_service"),
    path("create_live_games/", create_live_games, name="create_live_games"),
    path('delete_live_game/', delete_live_game, name='delete_live_game'),
    path('award_points/', award_points, name='award_points'),
    path('finish_event/<int:event_id>/', finish_event, name='finish_event'),
    
    path('get_organizer_notifications/', get_organizer_notifications, name='get_organizer_notifications'),
    path('mark_organizer_notification_as_read/', mark_organizer_notification_as_read, name='mark_organizer_notification_as_read'),
    
    path('employees/', employees, name='employees'),
    path('approve_employee/', approve_employee, name='approve_employee'),
    path('deny_employee/', deny_employee, name='deny_employee'),
    path('get_employee_requests/', get_employee_requests, name='get_employee_requests'),
    path('events/<int:event_id>/mark_attendance/', mark_attendance, name='mark_attendance'),
    path('events/<int:event_id>/generate_qr/', generate_qr_code, name='generate_qr'),    
    # Аутентификация
    path('sign_in/', sign_in, name='sign_in'),
    path('sign_up/', sign_up, name='sign_up'),
    path('hobbies/', hobbies, name='hobbies'),
    path('save_hobbies/', save_hobbies, name='save_hobbies'),
    path('logout/', LogoutView.as_view(), name='logout'),  # Встроенный обработчик


    
    
]
