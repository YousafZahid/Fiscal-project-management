from django.contrib.auth.models import User
from django.db import models
from django.utils.timezone import now
from datetime import date
from decimal import Decimal

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
    date_saved = models.DateField(default=now)
    

class Budget(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="budget")
    expense_budget = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    emergency_fund_budget = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    debt_budget = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    retirement_budget = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    goal_budget = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)

    def __str__(self):
        return f"{self.user.username}'s Budget"


class EmergencyFund(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="emergency_fund")
    goal_amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Goal Amount")  # User sets this
    saved_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # Total saved so far

    def progress_percentage(self):
        """Calculate progress percentage towards goal"""
        if self.goal_amount > 0:
            return (self.saved_amount / self.goal_amount) * 100
        return 0

    def __str__(self):
        return f"{self.user.username} - Goal: {self.goal_amount}, Saved: {self.saved_amount}"


class EmergencyFundTransaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="emergency_fund_transactions")
    emergency_fund = models.ForeignKey(EmergencyFund, on_delete=models.CASCADE, related_name="transactions")
    amount_saved = models.DecimalField(max_digits=10, decimal_places=2)  # Amount added
    date_saved = models.DateField(default=now)  # When the money was saved

    def __str__(self):
        return f"{self.user.username} - {self.amount_saved} on {self.date_saved}"
  

class Goal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    target_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    saved_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    due_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def days_remaining(self):
        """Calculate remaining days for the goal."""
        today = date.today()
        return (self.due_date - today).days if self.due_date >= today else 0

    def goal_category(self):
        """Determine if the goal is Short-Term, Mid-Term, or Long-Term."""
        days = self.days_remaining()
        if days <= 90:
            return "Short-Term"
        elif days <= 365:
            return "Mid-Term"
        else:
            return "Long-Term"

    def priority_level(self):
        """Determine priority level based on urgency."""
        days = self.days_remaining()
        if days <= 90:
            return "High Priority"
        elif days <= 365:
            return "Medium Priority"
        else:
            return "Low Priority"

    def suggested_saving_plan(self):
        """
        Suggest how much the user should save per week/month 
        to achieve their goal before the deadline.
        """
        days_left = self.days_remaining()
        remaining_amount = float(self.target_amount) - float(self.saved_amount)

        if days_left == 0:
            return {"message": "Goal deadline reached!"}

        weeks_left = days_left / 7
        months_left = days_left / 30

        return {
            "weekly_savings": round(remaining_amount / weeks_left, 2) if weeks_left > 0 else 0,
            "monthly_savings": round(remaining_amount / months_left, 2) if months_left > 0 else 0,
            "days_left": days_left,
        }

    def progress_percentage(self):
        """Calculate goal progress in %."""
        if self.target_amount > 0:
            return round((float(self.saved_amount) / float(self.target_amount)) * 100, 2)
        return 0
