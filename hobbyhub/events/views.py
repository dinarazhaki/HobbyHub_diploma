from django.shortcuts import render

# Create your views here.
from .models import Event
from django.core.serializers import serialize
import json


def guest_page(request):
    return render(request,'guest.html')

def organizer_view(request):
    events=Event.objects.all()
    return render(request,'organizer.html',{'events':events})


def user_view(request):
    events = Event.objects.all()
    
    events_json = serialize('json', events, fields=('title', 'date', 'location', 'image'))
    
    events_data = json.loads(events_json)
    
    return render(request, 'user.html', {'events': events, 'events_data': events_data})

def user_profile(request):  #!!!!need to update
    return render(request,'userprofile.html')


def profile_user_act(request):  #!!!!need to update
    return render(request,'profile_user_act.html')

def user_achievements(request):  #!!!!need to update
    return render(request,'user_achievements.html')

def user_setting(request):  #!!!!need to update
    return render(request,'user_setting.html')

def user_language(request):  #!!!!need to update
    return render(request,'language_options.html')

def user_notification(request):  #!!!!need to update
    return render(request,'notif_preferences.html')

def user_privacy(request):  #!!!!need to update
    return render(request,'privacy_settings.html')