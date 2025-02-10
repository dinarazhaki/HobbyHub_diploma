# Generated by Django 5.1.5 on 2025-02-09 09:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0006_alter_company_options_company_date_joined_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='company',
            options={},
        ),
        migrations.RemoveField(
            model_name='company',
            name='date_joined',
        ),
        migrations.RemoveField(
            model_name='company',
            name='first_name',
        ),
        migrations.RemoveField(
            model_name='company',
            name='last_name',
        ),
        migrations.AlterField(
            model_name='company',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='company',
            name='is_staff',
            field=models.BooleanField(default=False),
        ),
    ]
