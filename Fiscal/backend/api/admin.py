from django.contrib import admin
from .models import (
    PersonalDetails,
    AnnualIncome,
    Asset,
    Loan,
    CreditCardDebt,
    Mortgage,
    DebtTransactionHistory,
    Expense,
    Budget,
    EmergencyFund,
    EmergencyFundTransaction,
    Goal,
    RetirementPlan,
    RetirementContribution,
)

class PersonalDetailsAdmin(admin.ModelAdmin):
    list_display = ('user', 'age', 'marital_status', 'number_of_children', 'created_at')
    list_filter = ('marital_status',)
    search_fields = ('user__username',)

# Optional: only do this if it was already registered


# Register with custom admin
admin.site.register(PersonalDetails, PersonalDetailsAdmin)


admin.site.register(AnnualIncome)
admin.site.register(Asset)
admin.site.register(Loan)
admin.site.register(CreditCardDebt)
admin.site.register(Mortgage)
admin.site.register(DebtTransactionHistory)
admin.site.register(Expense)
admin.site.register(Budget)
admin.site.register(EmergencyFund)
admin.site.register(EmergencyFundTransaction)
admin.site.register(Goal)
admin.site.register(RetirementContribution)
admin.site.register(RetirementPlan)
