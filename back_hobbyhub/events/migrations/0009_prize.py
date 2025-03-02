# Generated by Django 5.1.5 on 2025-03-02 21:32

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0008_employee_social_id_employee_social_provider'),
    ]

    operations = [
        migrations.CreateModel(
            name='Prize',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, verbose_name='Prize Name')),
                ('description', models.TextField(verbose_name='Prize Description')),
                ('image', models.ImageField(blank=True, null=True, upload_to='prizes/', verbose_name='Prize Image')),
                ('rank', models.IntegerField(unique=True, verbose_name='Rank')),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Company')),
            ],
        ),
    ]
