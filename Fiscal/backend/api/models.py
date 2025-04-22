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
    created_at = models.DateTimeField(auto_now_add=True)  # Automatically sets the creation date/time

    def __str__(self):
        return f"{self.user.username}'s Personal Details"

class AnnualIncome(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="annual_incomes")
    category = models.CharField(max_length=255)
    frequency = models.CharField(max_length=50)
    amount = models.FloatField()
    description = models.TextField(null=True, blank=True)
    currency = models.CharField(max_length=10, default="PKR")

class Asset(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="assets")
    retirement_plan = models.ForeignKey("RetirementPlan", on_delete=models.CASCADE, related_name="assets", null=True, blank=True)
    category = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    amount = models.FloatField()
    currency = models.CharField(max_length=10, default="PKR")

class Liability(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    start_date = models.DateField(null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)
    remaining_balance = models.FloatField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)

    class Meta:
        abstract = True

# Simple Loan model
class Loan(Liability):
    loan_amount = models.FloatField(null=True, blank=True)
    interest_rate = models.FloatField(null=True, blank=True)  # annual interest rate %
    loan_term = models.CharField(max_length=100, null=True, blank=True)  # e.g. "5 years"
    monthly_payment = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"Loan - {self.user.username}"

# Credit Card Debt model
class CreditCardDebt(Liability):
    credit_card_balance = models.FloatField(null=True, blank=True)
    credit_card_apr = models.FloatField(null=True, blank=True)  # annual percentage rate
    minimum_payment = models.FloatField(null=True, blank=True)
    credit_limit = models.FloatField(null=True, blank=True)
    revolving_balance = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"Credit Card Debt - {self.user.username}"

class Mortgage(Liability):
    mortgage_amount = models.FloatField(null=True, blank=True)
    mortgage_interest_rate = models.FloatField(null=True, blank=True)
    mortgage_term_length = models.CharField(max_length=100, null=True, blank=True)  # e.g. "30 years"
    mortgage_monthly_payment = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"Mortgage - {self.user.username}"
    
class DebtTransactionHistory(models.Model):
    # Define choices for debt types (Loan, Credit Card Debt, Mortgage)
    LIABILITY_CHOICES = (
        ('loan', 'Loan'),
        ('credit_card_debt', 'Credit Card Debt'),
        ('mortgage', 'Mortgage'),
    )

    # ForeignKeys to each liability model (Only one will be used per transaction)
    loan = models.ForeignKey('Loan', null=True, blank=True, on_delete=models.CASCADE)
    credit_card_debt = models.ForeignKey('CreditCardDebt', null=True, blank=True, on_delete=models.CASCADE)
    mortgage = models.ForeignKey('Mortgage', null=True, blank=True, on_delete=models.CASCADE)

    # Field to specify the type of liability (used for filtering)
    liability_type = models.CharField(max_length=50, choices=LIABILITY_CHOICES)

    # Date of the transaction
    transaction_date = models.DateField()

    # Amount of the transaction (positive for payments, negative for debt accumulation)
    amount = models.FloatField()

    # Description for the transaction (e.g., "Monthly payment", "Interest charge")
    description = models.CharField(max_length=255)

    # Link the transaction to a specific user
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Transaction for {self.user.username} on {self.transaction_date} ({self.liability_type})"

    # Method to ensure transactions are linked correctly to each liability type
    def get_related_liability(self):
        if self.liability_type == 'loan':
            return self.loan
        elif self.liability_type == 'credit_card_debt':
            return self.credit_card_debt
        elif self.liability_type == 'mortgage':
            return self.mortgage
        return None
# Mortgage model

class Expense(models.Model):
    CATEGORY_CHOICES = (
        ('fixed', 'Fixed'),
        ('variable', 'Variable'),
    )

    RECURRENCE_CHOICES = (
        ('none', 'None'),
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES)
    subcategory = models.CharField(max_length=100, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    date = models.DateField(default=now)
    recurrence = models.CharField(max_length=10,choices=RECURRENCE_CHOICES,null=True,blank=True)

    def __str__(self):
        return f"{self.category} - {self.subcategory} - {self.amount}"

class Budget(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="budget")
    expense_budget = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    emergency_fund_budget = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    debt_budget = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    retirement_budget = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    goal_budget = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)

    def __str__(self):
        return f"{self.user.username}'s Budget"


class MonthlyBudget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="monthly_budgets")
    month = models.PositiveSmallIntegerField()  # 1-12
    year = models.PositiveIntegerField()

    # Budgeted amounts
    budgeted_expense = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    budgeted_emergency_fund = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    budgeted_debt = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    budgeted_retirement = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    budgeted_goal = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)

    # Actual spendings
    spent_expense = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    spent_emergency_fund = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    spent_debt = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    spent_retirement = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    spent_goal = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'month', 'year')
        ordering = ['-year', '-month']

    def __str__(self):
        return f"{self.user.username} - {self.month}/{self.year} Monthly Budget"

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


class RetirementPlan(models.Model):
   
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="retirement_plan")  
    current_age = models.PositiveIntegerField()
    retirement_age = models.PositiveIntegerField()
    life_expectancy = models.PositiveIntegerField(default=85)
    desired_income = models.DecimalField(max_digits=12, decimal_places=2)
    is_annual_income = models.BooleanField(default=True)
    current_savings = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    inflation_rate = 9.48 
    created_at = models.DateTimeField(auto_now_add=True)

    def retirement_duration(self):
        return max(0, self.life_expectancy - self.retirement_age)

    def years_until_retirement(self):
        return max(0, self.retirement_age - self.current_age)

    def monthly_income_needed(self):
        if self.is_annual_income:
            years = self.years_until_retirement()
            adjusted_income = float(self.desired_income) * ((1 + self.inflation_rate / 100) ** years)
            return round(adjusted_income / 12, 2)
        else:
            return float(self.desired_income)

    def __str__(self):
        return f"{self.user.username}'s Retirement Plan"


class RetirementContribution(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="retirement_contributions")
    retirement_plan = models.ForeignKey(RetirementPlan, on_delete=models.CASCADE, related_name="contributions")
    
    amount_contributed = models.DecimalField(max_digits=10, decimal_places=2)
    date_contributed = models.DateField(default=now)
    note = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.amount_contributed} on {self.date_contributed}"
