# Generated by Django 3.0 on 2019-12-13 12:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0026_auto_20191210_1628'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cart',
            name='selected_toppings',
            field=models.CharField(max_length=600),
        ),
    ]
