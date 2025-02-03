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