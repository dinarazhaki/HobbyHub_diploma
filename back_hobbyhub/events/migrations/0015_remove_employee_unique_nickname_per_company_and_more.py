# Generated by Django 5.1.5 on 2025-02-09 18:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0014_employee_id_alter_employee_company_and_more'),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name='employee',
            name='unique_nickname_per_company',
        ),
        migrations.RemoveField(
            model_name='employee',
            name='id',
        ),
        migrations.AlterField(
            model_name='company',
            name='email',
            field=models.EmailField(max_length=254, unique=True, verbose_name='Company Email'),
        ),
        migrations.AlterField(
            model_name='employee',
            name='join_date',
            field=models.DateField(auto_now_add=True, verbose_name='Join Date'),
        ),
        migrations.AlterField(
            model_name='employee',
            name='name',
            field=models.CharField(max_length=255, verbose_name='First Name'),
        ),
        migrations.AlterField(
            model_name='employee',
            name='nickname',
            field=models.CharField(max_length=100, primary_key=True, serialize=False, verbose_name='Nickname'),
        ),
        migrations.AlterField(
            model_name='employee',
            name='number',
            field=models.CharField(max_length=20, verbose_name='Phone Number'),
        ),
        migrations.AlterField(
            model_name='event',
            name='date',
            field=models.DateField(verbose_name='Date'),
        ),
        migrations.AlterField(
            model_name='event',
            name='description',
            field=models.TextField(verbose_name='Description'),
        ),
        migrations.AlterField(
            model_name='event',
            name='hobby_type',
            field=models.CharField(max_length=150, verbose_name='Hobby Type'),
        ),
        migrations.AlterField(
            model_name='event',
            name='location',
            field=models.CharField(max_length=250, verbose_name='Location'),
        ),
        migrations.AlterField(
            model_name='event',
            name='time',
            field=models.TimeField(verbose_name='Time'),
        ),
        migrations.AlterField(
            model_name='event',
            name='title',
            field=models.CharField(max_length=150, verbose_name='Title'),
        ),
    ]
