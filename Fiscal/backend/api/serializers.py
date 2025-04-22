from .models import (Budget, 
                     Expense, 
                     EmergencyFund, 
                     EmergencyFundTransaction, 
                     Goal, 
                     Loan, 
                     CreditCardDebt, 
                     Mortgage, 
                     DebtTransactionHistory, 
                     Liability, 
                     RetirementPlan, 
                     RetirementContribution,
                     Asset,
)
from rest_framework import serializers
from django.contrib.auth.models import User

class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        user.is_active = False  # User will be inactive until email verification
        user.save()
        return user



class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = [
            'expense_budget',
            'emergency_fund_budget',
            'debt_budget',
            'retirement_budget',
            'goal_budget',
        ]

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = [
            'id',
            'user',
            'category',
            'subcategory',
            'amount',
            'description',
            'date',
            'recurrence',
        ]
        extra_kwargs = {
            'user': {'read_only': True}  # prevent frontend from needing to send it
        }

    def validate(self, data):
        category = data.get('category')
        recurrence = data.get('recurrence')
        amount = data.get('amount')
        # If the category is fixed, recurrence_date is required
        if category == 'fixed' and not recurrence:
            raise serializers.ValidationError({
                'recurrence': 'This field is required for fixed expenses.'
        })
        

        if amount is not None and amount <= 0:
            raise serializers.ValidationError({
                'amount': 'Amount must be a positive number.'
        })


        return data

class EmergencyFundSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyFund
        fields = ['user', 'goal_amount', 'saved_amount']
        read_only_fields = ['user']

class EmergencyFundTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyFundTransaction
        fields = ['amount_saved', 'date_saved', 'emergency_fund']

class GoalSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField()
    priority = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()
    saving_plan = serializers.SerializerMethodField()
    
    class Meta:
        model = Goal
        fields = ["id", "name", "target_amount", "saved_amount", "due_date", "created_at", "category", "priority", "progress", "saving_plan"]
        
    def get_category(self, obj):
        return obj.goal_category()

    def get_priority(self, obj):
        return obj.priority_level()

    def get_progress(self, obj):
        return obj.progress_percentage()

    def get_saving_plan(self, obj):
        return obj.suggested_saving_plan()

class LoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan
        fields = '__all__'
        read_only_fields = ['user']

    def get_progress(self, obj):
        if obj.loan_amount and obj.remaining_balance is not None:
            paid = obj.loan_amount - obj.remaining_balance
            progress = max(0, min(100, (paid / obj.loan_amount) * 100))
            return round(progress, 2)
        return 0
    
class CreditCardDebtSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditCardDebt
        fields = '__all__'
        read_only_fields = ['user']

    def get_progress(self, obj):
        if obj.credit_card_balance and obj.remaining_balance is not None:
            paid = obj.credit_card_balance - obj.remaining_balance
            progress = max(0, min(100, (paid / obj.credit_card_balance) * 100))
            return round(progress, 2)
        return 0

class MortgageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mortgage
        fields = '__all__'
        read_only_fields = ['user']

    def get_progress(self, obj):
        if obj.mortgage_amount and obj.remaining_balance is not None:
            paid = obj.mortgage_amount - obj.remaining_balance
            progress = max(0, min(100, (paid / obj.mortgage_amount) * 100))
            return round(progress, 2)
        return 0

class DebtTransactionHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DebtTransactionHistory
        fields = '__all__'
        read_only_fields = ['user']
# class DebtTransactionHistorySerializer(serializers.ModelSerializer):
#     loan = LoanSerializer(read_only=True, required=False)
#     credit_card_debt = CreditCardDebtSerializer(read_only=True, required=False)
#     mortgage = MortgageSerializer(read_only=True, required=False)
    
#     class Meta:
#         model = DebtTransactionHistory
#         fields = '__all__'

#     def create(self, validated_data):
#         """
#         Custom create method to handle the creation of transaction records.
#         """
#         loan_data = validated_data.pop('loan', None)
#         credit_card_debt_data = validated_data.pop('credit_card_debt', None)
#         mortgage_data = validated_data.pop('mortgage', None)
        
#         # Handle creation of DebtTransactionHistory and link to a loan, credit card debt, or mortgage
#         transaction = DebtTransactionHistory.objects.create(**validated_data)
        
#         if loan_data:
#             transaction.loan = Loan.objects.create(**loan_data)
#         elif credit_card_debt_data:
#             transaction.credit_card_debt = CreditCardDebt.objects.create(**credit_card_debt_data)
#         elif mortgage_data:
#             transaction.mortgage = Mortgage.objects.create(**mortgage_data)
        
#         transaction.save()
#         return transaction


class RetirementPlanSerializer(serializers.ModelSerializer):
    included_assets = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )

    class Meta:
        model = RetirementPlan
        fields = '__all__'
        read_only_fields = ['user', 'created_at']

    def create(self, validated_data):
        
        included_assets = validated_data.pop('included_assets', [])
        plan = RetirementPlan.objects.create(**validated_data)

        # Link assets to the plan
        Asset.objects.filter(id__in=included_assets, user=plan.user).update(retirement_plan=plan)

        return plan


class RetirementContributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RetirementContribution
        fields = '__all__'
        read_only_fields = ['user', 'retirement_plan']

class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = '__all__'
        read_only_fields = ['user']
