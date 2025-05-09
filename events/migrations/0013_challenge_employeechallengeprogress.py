# Generated by Django 5.1.5 on 2025-03-17 03:13

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0012_notification'),
    ]

    operations = [
        migrations.CreateModel(
            name='Challenge',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, verbose_name='Challenge Name')),
                ('description', models.TextField(verbose_name='Challenge Description')),
                ('type', models.CharField(choices=[('activity', 'Activity Participation'), ('skill', 'Skill Development'), ('competition', 'Competition & Challenges'), ('xp', 'Achievement Points'), ('consistency', 'Consistency Challenges')], max_length=50, verbose_name='Challenge Type')),
                ('goal', models.IntegerField(verbose_name='Goal (e.g., number of activities, XP, etc.)')),
                ('reward_diamonds', models.IntegerField(default=0, verbose_name='Reward Diamonds')),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Company')),
            ],
        ),
        migrations.CreateModel(
            name='EmployeeChallengeProgress',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('progress', models.IntegerField(default=0, verbose_name='Progress')),
                ('is_completed', models.BooleanField(default=False, verbose_name='Completed')),
                ('challenge', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='progress', to='events.challenge')),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='challenge_progress', to='events.employee')),
            ],
        ),
    ]
