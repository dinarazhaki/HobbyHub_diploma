# Generated by Django 5.1.5 on 2025-03-16 20:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0010_alter_prize_rank_prize_unique_rank_per_company'),
    ]

    operations = [
        migrations.AddField(
            model_name='employee',
            name='receive_email_notifications',
            field=models.BooleanField(default=True, verbose_name='Receive Email Notifications'),
        ),
        migrations.AddField(
            model_name='employee',
            name='receive_reminders',
            field=models.BooleanField(default=True, verbose_name='Receive Reminders'),
        ),
        migrations.AddField(
            model_name='employee',
            name='receive_sms_notifications',
            field=models.BooleanField(default=True, verbose_name='Receive SMS Notifications'),
        ),
    ]
