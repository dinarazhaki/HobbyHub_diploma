# Generated by Django 5.1.5 on 2025-02-01 19:38

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=150)),
                ('description', models.TextField()),
                ('location', models.CharField(max_length=250)),
                ('date', models.DateField()),
                ('time', models.TimeField()),
                ('hobby_type', models.CharField(max_length=150)),
                ('image', models.ImageField(blank=True, null=True, upload_to='event_images/')),
            ],
        ),
    ]
