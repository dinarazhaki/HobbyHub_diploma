# Generated by Django 5.1.5 on 2025-02-09 11:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0008_company_profile_picture'),
    ]

    operations = [
        migrations.RenameField(
            model_name='company',
            old_name='profile_picture',
            new_name='profile_image',
        ),
    ]
