# Generated by Django 5.1.5 on 2025-04-19 16:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0027_alter_notification_is_read'),
    ]

    operations = [
        migrations.AlterField(
            model_name='challenge',
            name='type',
            field=models.CharField(choices=[('activity', 'Booking Challenges'), ('skill', 'Skill Development'), ('competition', 'Competition & Challenges'), ('xp', 'Achievement Points'), ('consistency', 'Consistency Challenges'), ('attendance', 'Attendance Challenges')], max_length=50, verbose_name='Challenge Type'),
        ),
    ]
