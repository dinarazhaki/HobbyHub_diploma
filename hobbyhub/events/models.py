from django.db import models

# Create your models here.
class Event(models.Model):
    title=models.CharField(max_length=150)
    description=models.TextField()
    location=models.CharField(max_length=250)
    date=models.DateField()
    time=models.TimeField()
    hobby_type=models.CharField(max_length=150)
    image=models.ImageField(upload_to='event_images/', height_field=None, width_field=None, max_length=None,  null=True, blank=True)
    
    def __str__(self):
        return self.title
    