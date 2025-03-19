from .models import Budget, Expense, EmergencyFund
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
        fields = ['id', 'user', 'category', 'description', 'amount']



class EmergencyFundSerializer(serializers.ModelSerializer):
    progress = serializers.SerializerMethodField()

    class Meta:
        model = EmergencyFund
        fields = ["goal_amount", "monthly_budget", "saved_amount", "date_saved", "progress"]

    def get_progress(self, obj):
        return obj.progress_percentage()