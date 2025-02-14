# Generated by Django 5.1.3 on 2025-02-03 08:39

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Budget",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "expense_budget",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                (
                    "emergency_fund_budget",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                (
                    "debt_budget",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                (
                    "retirement_budget",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                (
                    "goal_budget",
                    models.DecimalField(decimal_places=2, default=0.0, max_digits=12),
                ),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="budget",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
