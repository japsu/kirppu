# -*- coding: utf-8 -*-
# Django settings for kirppu project.
from __future__ import unicode_literals, print_function, absolute_import
import os.path
from django.utils.translation import ugettext_lazy as _

BASE = os.path.dirname(os.path.abspath(__file__))
_path = lambda path: os.path.normpath(os.path.join(BASE, '..', path))

DEBUG = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',  # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': _path('db.sqlite'),              # Or path to database file if using sqlite3.
        # The following settings are not used with sqlite3:
        'USER': '',
        'PASSWORD': '',
        'HOST': '',  # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '',  # Set to empty string for default.
    }
}

# Hosts/domain names that are valid for this site; required if DEBUG is False
# See https://docs.djangoproject.com/en/1.5/ref/settings/#allowed-hosts
ALLOWED_HOSTS = []

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# In a Windows environment this must be set to your system time zone.
TIME_ZONE = 'Europe/Helsinki'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'fi'

LANGUAGES = (
    ('fi', _("Finnish")),
    ('en', _("English")),
)

LOCALE_PATHS = (
    _path("locale"),
)

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = True

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/var/www/example.com/media/"
MEDIA_ROOT = ''

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://example.com/media/", "http://media.example.com/"
MEDIA_URL = ''

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/var/www/example.com/static/"
STATIC_ROOT = _path('static/')

# URL prefix for static files.
# Example: "http://example.com/static/", "http://static.example.com/"
STATIC_URL = '/static/'

# Additional locations of static files
STATICFILES_DIRS = (
    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    # 'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

# Make this unique, and don't share it with anybody.
SECRET_KEY = '=#j)-ml7x@a2iw9=#l7%i89l%cry6kch6x49=0%vcasq!!@97-'

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',

    'django.contrib.messages.middleware.MessageMiddleware',

    # Uncomment the next line for simple clickjacking protection:
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

AUTHENTICATION_BACKENDS = (
    'kompassi_oauth2.backends.KompassiOAuth2AuthenticationBackend',
    'django.contrib.auth.backends.ModelBackend',
)

ROOT_URLCONF = 'kirppu_project.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'kirppu_project.wsgi.application'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'APP_DIRS': True,
        'DIRS': (os.path.join(os.path.dirname(__file__), '..', 'templates').replace('\\', '/'),),
        'OPTIONS': {
            'debug': DEBUG,
            'context_processors': [
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.debug',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Uncomment the next line to enable the admin:
    'django.contrib.admin',
    # Uncomment the next line to enable admin documentation:
    # 'django.contrib.admindocs',
    'kirppuauth',
    'kirppu',
)

AUTH_USER_MODEL = 'kirppuauth.User'
KIRPPU_USER_ADAPTER = 'kirppu.models.UserAdapterBase'

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error when DEBUG=False.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        },
        'console': {
            'level': 'DEBUG' if DEBUG else 'WARNING',
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
        'celery': {
            'handlers': ['console'],
            'level': 'DEBUG' if DEBUG else 'WARNING',
            'propagate': True
        },
        'kompassi_oauth2': {
            'handlers': ['console'],
            'level': 'DEBUG' if DEBUG else 'WARNING',
            'propagate': True
        },
    },
}

# Mapping from Kompassi user fields to Kirppu user fields.
KOMPASSI_USER_MAP_V2 = [
    ('username', 'username'),
    ('email', 'email'),
    ('first_name', 'first_name'),
    ('last_name', 'surname'),
    ('phone', 'phone'),
]

KOMPASSI_API_URL = 'http://kompassi.dev:8001/api/v1'
KOMPASSI_API_APPLICATION_NAME = 'kirppu'
KOMPASSI_API_APPLICATION_PASSWORD = 'fill me in'

KOMPASSI_OAUTH2_AUTHORIZATION_URL = 'http://kompassi.dev:8001/oauth2/authorize'
KOMPASSI_OAUTH2_TOKEN_URL = 'http://kompassi.dev:8001/oauth2/token'
KOMPASSI_OAUTH2_REVOKE_URL = 'http://kompassi.dev:8001/oauth2/revoke'
KOMPASSI_OAUTH2_CLIENT_ID = 'kompassi_insecure_test_client_id'
KOMPASSI_OAUTH2_CLIENT_SECRET = 'kompassi_insecure_test_client_secret'
KOMPASSI_OAUTH2_SCOPE = ['read']
KOMPASSI_API_V2_USER_INFO_URL = 'http://kompassi.dev:8001/api/v2/people/me'

# Kirppu authentication configurations:
#
# Case     | LOGIN_URL       | LOGOUT_URL       | USE_SSO | kirppuauth? |
# ---------+-----------------+------------------+---------+-------------
# Internal | /accounts/login | /accounts/logout | False   | Yes
# Embed    | project url     | project url      | False   | No
# OAUTH2#1 | /oauth2/login   | /oauth2/logout   | True    | Yes
# OAUTH2#2 | /oauth2/login   | /accounts/logout | True    | Yes
#
# #1: Use this if server supports token revokation. KOMPASSI_OAUTH2_REVOKE_URL is needed.
# #2: Use this if server does not support token revokation.

# This can be left to default if kirppuauth module is installed.
# LOGIN_URL = '/oauth2/login'

# Absolute URL for user "Profile". Leave None if the link should not be displayed.
PROFILE_URL = None  # 'https://kompassidev.tracon.fi/profile'

# Whether external login and SSO clerk add are enabled (True) or not (False).
KIRPPU_USE_SSO = False

# If True, admin can change identity.
KIRPPU_SU_AS_USER = "kirppuauth" in INSTALLED_APPS

# Whether checkout functionality is active or not.
KIRPPU_CHECKOUT_ACTIVE = False

# Automatic checkout login. May not be enabled in non-dev environments!
# If True, first enabled Clerk is automatically used.
# If string, Clerk with that user is used, if it is enabled.
KIRPPU_AUTO_CLERK = False

KIRPPU_COPY_ITEM_WHEN_UNPRINTED = False
KIRPPU_MAX_ITEMS_PER_VENDOR = 1000

# Datetime of the instant of which Item registration is open until, in "YYYY-MM-DD HH:MM:SS" format.
# The specified date is expected to be in TIME_ZONE timezone.
KIRPPU_REGISTER_ACTIVE_UNTIL = "2024-12-31 23:59:59"

# Prefix- and postfix content of currency values.
KIRPPU_CURRENCY = {
    # Content text for currency spans.
    "css": ("", " \\20AC"),  # euro.
    # Content for html elements (that cannot be styled with css content).
    "html": ("", "&euro;"),
    # Content for raw text use (js).
    "raw": ("", " €"),
}

# Minimum and maximum price for an item.
KIRPPU_MIN_MAX_PRICE = ('1', '400')

# Maximum purchase amount.
KIRPPU_MAX_PURCHASE = '450'

# Load local settings that are not stored in repository. This must be last at end of settings.
try:
    from .local_settings import *
except ImportError:
    if DEBUG:
        print("Module local_settings not found.")
