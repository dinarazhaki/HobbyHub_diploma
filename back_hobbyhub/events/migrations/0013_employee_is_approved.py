# Generated by Django 5.1.5 on 2025-02-09 14:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0012_rename_profile_picture_company_profile_photo'),
    ]

    operations = [
        migrations.AddField(
            model_name='employee',
            name='is_approved',
            field=models.BooleanField(default=False, verbose_name='Approved'),
        ),
    ]
