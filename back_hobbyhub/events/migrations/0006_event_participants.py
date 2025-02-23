# Generated by Django 5.1.5 on 2025-02-23 21:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0005_rename_hobby_type_event_hobbies'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='participants',
            field=models.ManyToManyField(blank=True, related_name='events', to='events.employee'),
        ),
    ]
