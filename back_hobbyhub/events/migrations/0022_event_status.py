# Generated by Django 5.1.5 on 2025-04-12 08:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0021_event_event_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='status',
            field=models.CharField(choices=[('upcoming', 'Upcoming'), ('in_progress', 'In Progress'), ('completed', 'Completed')], default='upcoming', max_length=12),
        ),
    ]
