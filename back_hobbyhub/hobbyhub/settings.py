"""
Django settings for hobbyhub project.

Generated by 'django-admin startproject' using Django 5.1.5.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

from pathlib import Path
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-nub2-er(f#0ty4030vj2$$&ocl!mcs$nlu)f24mka0k&70yod#'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS =["127.0.0.1", "localhost", '192.168.3.73','192.168.0.14']
# ['localhost', '127.0.0.1', '192.168.3.30', 'hobbyhub.com', 'www.hobbyhub.com']
CSRF_TRUSTED_ORIGINS = ['http://127.0.0.1:8000', 'http://localhost:8000', 'http://192.168.3.73:8000', 'http://192.168.0.14:8000']

# CSRF_TRUSTED_ORIGINS = ['http://hobbyhub.com', 'http://www.hobbyhub.com', 'http://192.168.3.30:8000']




# Application definition
SITE_ID=2

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'events',
    'social_django',
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
]

SOCIALACCOUNT_PROVIDERS= {
    "google": {
        "SCOPE":[
            "email",
            "profile"
        ],
        "AUTH_PARAMS":{"access_type": "online"}
    }
}
AUTHENTICATION_BACKENDS = [
    'social_core.backends.google.GoogleOAuth2',
    'social_core.backends.microsoft.MicrosoftOAuth2',
    'social_core.backends.facebook.FacebookOAuth2',
    'social_core.backends.apple.AppleIdAuth',
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]



# Настройки для Google
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = 'ваш-client-id-google'
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = 'ваш-client-secret-google'

# Настройки для Microsoft
SOCIAL_AUTH_MICROSOFT_GRAPH_KEY = 'ваш-client-id-microsoft'
SOCIAL_AUTH_MICROSOFT_GRAPH_SECRET = 'ваш-client-secret-microsoft'

# Настройки для Facebook
SOCIAL_AUTH_FACEBOOK_KEY = 'ваш-app-id-facebook'
SOCIAL_AUTH_FACEBOOK_SECRET = 'ваш-app-secret-facebook'

# Настройки для Apple
SOCIAL_AUTH_APPLE_ID_CLIENT = 'ваш-client-id-apple'
SOCIAL_AUTH_APPLE_ID_TEAM = 'ваш-team-id-apple'
SOCIAL_AUTH_APPLE_ID_KEY = 'ваш-key-id-apple'
SOCIAL_AUTH_APPLE_ID_SECRET = 'ваш-secret-key-apple'

SOCIAL_AUTH_PIPELINE = (
    'social_core.pipeline.social_auth.social_details',
    'social_core.pipeline.social_auth.social_uid',
    'social_core.pipeline.social_auth.auth_allowed',
    'social_core.pipeline.social_auth.social_user',
    'social_core.pipeline.user.get_username',
    'social_core.pipeline.user.create_user',
    'social_core.pipeline.social_auth.associate_user',
    'social_core.pipeline.social_auth.load_extra_data',
    'social_core.pipeline.user.user_details',
    'your_app.pipeline.save_profile', 
)

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'events.middleware.SessionControlMiddleware',
    'allauth.account.middleware.AccountMiddleware',

]

ROOT_URLCONF = 'hobbyhub.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'hobbyhub.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Almaty'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = '/static/'
# STATIC_ROOT =os.path.join(BASE_DIR, '/static/')
STATICFILES_DIRS = [
    (BASE_DIR / 'events/static/'),  
]
# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'events/media/')

AUTH_USER_MODEL = "events.Company"
LOGIN_REDIRECT_URL = "/"
LOGOUT_REDIRECT_URL = '/'
SESSION_ENGINE = "django.contrib.sessions.backends.db"  # Использование БД
SESSION_COOKIE_AGE = 1209600  # Две недели
SESSION_SAVE_EVERY_REQUEST = True  # Обновление сессии при каждом запросе
SESSION_EXPIRE_AT_BROWSER_CLOSE = False

ACCOUNT_USER_MODEL_USERNAME_FIELD = None
ACCOUNT_SIGNUP_FIELDS = ['email*', 'password1*', 'password2*']

ACCOUNT_LOGIN_METHODS = {"email"}
