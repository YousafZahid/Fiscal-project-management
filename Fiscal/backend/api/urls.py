from django.urls import path
from .views import (Signup, 
                    VerifyEmail, 
                    UserLogin, 
                    SaveUserData, 
                    BudgetView, 
                    ExpenseListView, 
                    AddExpenseView, 
                    UpdateExpenseView, 
                    DeleteExpenseView, 
                    EmergencyFundView, 
                    IncomeView, 
                    EmergencyFundTransactionView, 
                    EmergencyFundIDView, 
                    GoalView, 
                    LoanView, 
                    CreditCardDebtView,
                    MortgageView, 
                    AddDebtTransactionView, 
                    LiabilitiesSummaryView, 
                    LoanDetailView, 
                    CreditCardDebtDetailView, 
                    MortgageDetailView, 
                    GetAllLiabilities, 
                    RetirementPlanView, 
                    RetirementContributionView,
                    AssetAPI
                    )

urlpatterns = [
    path("signup/", Signup.as_view(), name="signup"),  # Signup endpoint
    path("verify-email/", VerifyEmail.as_view(), name="verify-email"),  # Email verification
    path("login/", UserLogin.as_view(), name="login"),  # Login endpoint
    
    path("save-user-data/", SaveUserData.as_view(), name="save-user-data"),  # Login endpoint
    path("budget/", BudgetView.as_view(), name="budget"),
    path("income/", IncomeView.as_view(), name="income"),
    
    path("expenses/", ExpenseListView.as_view(), name="expense-list"),  # Get all expenses
    path("add-expense/", AddExpenseView.as_view(), name="add-expense"),  # Add a new expense
    path("update-expense/<int:expense_id>/", UpdateExpenseView.as_view(), name="update-expense"),  # Update expense
    path("delete-expense/<int:expense_id>/", DeleteExpenseView.as_view(), name="delete-expense"),  # Delete expense
    
    path('emergencyfund/', EmergencyFundView.as_view(), name='emergencyfund'),
    path("emergency-fund-transactions/", EmergencyFundTransactionView.as_view(), name="emergency-fund-transactions"),
    path("emergency-fund-id/", EmergencyFundIDView.as_view(), name="user-id"),
    
    path("goals/", GoalView.as_view(), name="goals"),
    path("goals/<int:goal_id>/", GoalView.as_view(), name="goal-detail"),
    
    #  path("loans/", LoanView.as_view(), name="loan-list"),  # Get all loans
    # path("loans/<int:loan_id>/", LoanDetailView.as_view(), name="loan-detail"),  # Get, update or delete a specific loan
    path('liabilities/', GetAllLiabilities.as_view(), name='get_all_liabilities'),
    path("loans/", LoanView.as_view(), name="loan-list-create"),
    path("loans/<int:pk>/", LoanDetailView.as_view(), name="loan-detail"),

    path("credit-cards/", CreditCardDebtView.as_view(), name="creditcard-list-create"),
    path("credit-cards/<int:pk>/", CreditCardDebtDetailView.as_view(), name="creditcard-detail"),

    path("mortgages/", MortgageView.as_view(), name="mortgage-list-create"),
    path("mortgages/<int:pk>/", MortgageDetailView.as_view(), name="mortgage-detail"),

    path("debt-transactions/", AddDebtTransactionView.as_view(), name="debt-transaction"),
    path("liabilities-summary/", LiabilitiesSummaryView.as_view(), name="liabilities-summary"),

    path('retirement-plan/', RetirementPlanView.as_view(), name='retirement_plan_view'),
    path('retirement-contribution/', RetirementContributionView.as_view(), name='retirement_contribution_view'),
    path('assets/', AssetAPI.as_view(), name='asset_api'),

]