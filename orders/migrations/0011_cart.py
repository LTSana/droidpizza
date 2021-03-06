# Generated by Django 2.1.5 on 2019-11-07 21:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0010_pizza_price'),
    ]

    operations = [
        migrations.CreateModel(
            name='Cart',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('owner_id', models.IntegerField()),
                ('size', models.CharField(max_length=12)),
                ('crust', models.CharField(max_length=12)),
                ('toppings', models.IntegerField()),
                ('selected_toppings', models.CharField(max_length=64)),
                ('total_value', models.IntegerField()),
            ],
        ),
    ]
