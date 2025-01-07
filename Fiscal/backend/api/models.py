from django.contrib.auth.models import User
from django.db import models

class PersonalDetails(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="personal_details")
    age = models.PositiveIntegerField()
    marital_status = models.CharField(max_length=255)
    number_of_children = models.PositiveIntegerField(null=True, blank=True)

class AnnualIncome(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="annual_incomes")
    category = models.CharField(max_length=255)
    frequency = models.CharField(max_length=50)
    amount = models.FloatField()
    description = models.TextField(null=True, blank=True)
    currency = models.CharField(max_length=10, default="PKR")

class Asset(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="assets")
    category = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    amount = models.FloatField()
    currency = models.CharField(max_length=10, default="PKR")

class Liability(models.Model):
    CATEGORY_CHOICES = [
        ("Loan", "Loan"),
        ("Credit Card Debt", "Credit Card Debt"),
        ("Mortgage", "Mortgage"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    
    # Fields for Loan
    loan_amount = models.FloatField(null=True, blank=True)
    interest_rate = models.FloatField(null=True, blank=True)
    loan_term = models.CharField(max_length=100, null=True, blank=True)
    monthly_payment = models.FloatField(null=True, blank=True)
    remaining_balance = models.FloatField(null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)
    
    # Fields for Credit Card Debt
    credit_card_balance = models.FloatField(null=True, blank=True)
    credit_card_apr = models.FloatField(null=True, blank=True)
    minimum_payment = models.FloatField(null=True, blank=True)
    credit_limit = models.FloatField(null=True, blank=True)
    revolving_balance = models.FloatField(null=True, blank=True)
    
    # Fields for Mortgage
    mortgage_amount = models.FloatField(null=True, blank=True)
    mortgage_interest_rate = models.FloatField(null=True, blank=True)
    mortgage_term_length = models.CharField(max_length=100, null=True, blank=True)
    mortgage_monthly_payment = models.FloatField(null=True, blank=True)
    mortgage_remaining_balance = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.category} - {self.user.username}"
    

class Expense(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="expenses")
    category = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    amount = models.FloatField()
