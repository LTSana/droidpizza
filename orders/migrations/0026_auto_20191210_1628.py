# Generated by Django 3.0 on 2019-12-10 14:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0025_pizza_topping'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pizza',
            name='price',
            field=models.IntegerField(default=0),
        ),
    ]