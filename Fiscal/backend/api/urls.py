from django.urls import path
from .views import Signup, VerifyEmail, UserLogin, SaveUserData, BudgetView, ExpenseListView, AddExpenseView, UpdateExpenseView, DeleteExpenseView, EmergencyFundView, IncomeView

urlpatterns = [
    path("signup/", Signup.as_view(), name="signup"),  # Signup endpoint
    path("verify-email/", VerifyEmail.as_view(), name="verify-email"),  # Email verification
    path("login/", UserLogin.as_view(), name="login"),  # Login endpoint
    path("save-user-data/", SaveUserData.as_view(), name="save-user-data"),  # Login endpoint
    path("budget/", BudgetView.as_view(), name="budget"),
    path("expenses/", ExpenseListView.as_view(), name="expense-list"),  # Get all expenses
    path("add-expense/", AddExpenseView.as_view(), name="add-expense"),  # Add a new expense
    path("update-expense/<int:expense_id>/", UpdateExpenseView.as_view(), name="update-expense"),  # Update expense
    path("delete-expense/<int:expense_id>/", DeleteExpenseView.as_view(), name="delete-expense"),  # Delete expense
    path("income/", IncomeView.as_view(), name="income"),
    path("emergencyfund/", EmergencyFundView.as_view(), name="emergencyfund"),
]