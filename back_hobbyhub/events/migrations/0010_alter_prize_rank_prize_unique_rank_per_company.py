# Generated by Django 5.1.5 on 2025-03-02 22:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0009_prize'),
    ]

    operations = [
        migrations.AlterField(
            model_name='prize',
            name='rank',
            field=models.IntegerField(verbose_name='Rank'),
        ),
        migrations.AddConstraint(
            model_name='prize',
            constraint=models.UniqueConstraint(fields=('rank', 'company'), name='unique_rank_per_company'),
        ),
    ]
