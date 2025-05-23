import logging
from django.urls import reverse
from django.conf import settings
from rest_framework import status
from django.core.mail import send_mail
from rest_framework import viewsets
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from django.utils.timezone import now
from decimal import Decimal
from .models import (Liability, 
                     Asset, 
                     AnnualIncome, 
                     Expense, 
                     PersonalDetails, 
                     Budget, 
                     EmergencyFund, 
                     EmergencyFundTransaction, 
                     Goal, 
                     Loan, 
                     CreditCardDebt, 
                     Mortgage, 
                     RetirementContribution, 
                     RetirementPlan
                    )
from .serializers import (BudgetSerializer, 
                          ExpenseSerializer, 
                          EmergencyFundSerializer, 
                          EmergencyFundTransactionSerializer, 
                          GoalSerializer, 
                          LoanSerializer, 
                          CreditCardDebtSerializer, 
                          MortgageSerializer, 
                          DebtTransactionHistorySerializer, 
                          RetirementContributionSerializer, 
                          RetirementPlanSerializer, 
                          AssetSerializer
                        )


logger = logging.getLogger(__name__)
# Signup View
class Signup(APIView):      
    
    def post(self, request):
        
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        # Validate email format
        try:
            validate_email(email)
        except ValidationError:
            return Response({"error": "Invalid email format."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if email is already registered
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email is already registered."}, status=status.HTTP_400_BAD_REQUEST)

        # Create user
        try:
            user = User.objects.create_user(username=username, email=email, password=password, is_active=False)
            user.save()
        except Exception as e:
            logger.error(f"Error creating user: {str(e)}")
            return Response({"error": "Failed to create user."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Generate an access token for email verification
        try:
            token = str(AccessToken.for_user(user))
        except Exception as e:
            logger.error(f"Error generating token: {str(e)}")
            return Response({"error": "Failed to generate verification token."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Build the verification URL
        verify_url = request.build_absolute_uri(reverse('verify-email') + f'?token={token}')

        # Send verification email
        subject = "Verify Your Email"
        message = f"Hi {username},\n\nPlease click the link below to verify your email address:\n\n{verify_url}"
        try:
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email], fail_silently=False)
        except Exception as e:
            logger.error(f"Error sending email: {str(e)}")
            return Response({"error": f"Failed to send email: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"message": "Signup successful. Please verify your email."}, status=status.HTTP_201_CREATED)
# Verify Email View
class VerifyEmail(APIView):
    def get(self, request):
        token = request.GET.get('token')
        try:
            decoded_token = AccessToken(token)
            user_id = decoded_token['user_id']

            user = User.objects.get(id=user_id)
            user.is_active = True
            user.save()

            return Response({"message": "Email verified successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Login View
class UserLogin(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)

        if user is not None:
            if user.is_active:
                refresh = RefreshToken.for_user(user)
                return Response({
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "message": "Login successful!",
                }, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Email not verified."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)


class SaveUserData(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        user = request.user  
        data = request.data

        
        personal_data = data.get("personalDetails", {})
        PersonalDetails.objects.create(
            user=user,
            age=personal_data.get("age"),
            marital_status=personal_data.get("maritalStatus"),
            number_of_children=personal_data.get("numberOfChildren")
        )

        
        for income in data.get("annualIncome", []):
            AnnualIncome.objects.create(
                user=user,
                category=income.get("category"),
                frequency=income.get("frequency"),
                amount=income.get("amount"),
                description=income.get("description"),
                currency=income.get("currency", "PKR")
            )

       
        for asset in data.get("assets", []):
            Asset.objects.create(
                user=user,
                category=asset.get("category"),
                description=asset.get("description"),
                amount=asset.get("amount"),
                currency=asset.get("currency", "PKR")
            )

  
        for liability_data in data.get("liabilities", []):
            category = liability_data.get("category")
            if category == "Loan":
                Liability.objects.create(
                    user=request.user,
                    category=category,
                    loan_amount=liability_data.get("loanAmount"),
                    interest_rate=liability_data.get("interestRate"),
                    loan_term=liability_data.get("loanTerm"),
                    monthly_payment=liability_data.get("monthlyPayment"),
                    remaining_balance=liability_data.get("remainingBalance"),
                    start_date=liability_data.get("startDate"),
                    due_date=liability_data.get("dueDate"),
                )
            elif category == "Credit Card Debt":
                Liability.objects.create(
                    user=request.user,
                    category=category,
                    credit_card_balance=liability_data.get("creditCardBalance"),
                    credit_card_apr=liability_data.get("creditCardAPR"),
                    minimum_payment=liability_data.get("minimumPayment"),
                    monthly_payment=liability_data.get("monthlyPayment"),
                    credit_limit=liability_data.get("creditLimit"),
                    revolving_balance=liability_data.get("revolvingBalance"),
                )
            elif category == "Mortgage":
                Liability.objects.create(
                    user=request.user,
                    category=category,
                    mortgage_amount=liability_data.get("mortgageAmount"),
                    mortgage_interest_rate=liability_data.get("mortgageInterestRate"),
                    mortgage_term_length=liability_data.get("mortgageTermLength"),
                    mortgage_monthly_payment=liability_data.get("mortgageMonthlyPayment"),
                    mortgage_remaining_balance=liability_data.get("mortgageRemainingBalance"),
                )
            else:
                return Response(
                    {"error": "Invalid category for liabilities."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # Save Expenses
        for expense in data.get("expenses", []):
            Expense.objects.create(
                user=user,
                category=expense.get("category"),
                description=expense.get("description"),
                amount=expense.get("amount")
            )

        return Response({"message": "Data saved successfully."}, status=status.HTTP_201_CREATED)




#Expense tracking views
    
class ExpenseListView(APIView):
    print("list view called")
    permission_classes = [IsAuthenticated]
    #print(permission_classes)
    def get(self, request):
        user = request.user
        expenses = Expense.objects.filter(user=user)
        serializer = ExpenseSerializer(expenses, many=True)
        print(expenses)
        total_expenses = sum(exp.amount for exp in expenses)
        return Response({"expenses": serializer.data, "total_expenses": total_expenses}, status=status.HTTP_200_OK)


class AddExpenseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # data = request.data.copy()  # Create a mutable copy
            # data["user"] = request.user.id  # Assign the authenticated user
            # print("Got user and data", data["user"])

            # if "date" not in data:
            #     data["date_saved"] = now().date()
            #     print("date not gone through")

            serializer = ExpenseSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=request.user)
                # serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
class UpdateExpenseView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, expense_id):
        try:
            expense = Expense.objects.get(id=expense_id, user=request.user)
        except Expense.DoesNotExist:
            return Response({"error": "Expense not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ExpenseSerializer(expense, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteExpenseView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, expense_id):
        try:
            expense = Expense.objects.get(id=expense_id, user=request.user)
        except Expense.DoesNotExist:
            return Response({"error": "Expense not found"}, status=status.HTTP_404_NOT_FOUND)

        expense.delete()
        return Response({"message": "Expense deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class BudgetView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            budget = Budget.objects.get(user=request.user)
            serializer = BudgetSerializer(budget)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Budget.DoesNotExist:
            return Response({"error": "No budget found for the user."}, status=status.HTTP_404_NOT_FOUND)
    
    def post(self, request):
        # Check if a Budget row already exists for the user
        try:
            budget = Budget.objects.get(user=request.user)
            return self.put(request)  # Call the put function instead
        except Budget.DoesNotExist:
            pass  # If not found, proceed to create a new one

        serializer = BudgetSerializer(data=request.data)
        if serializer.is_valid():
            Budget.objects.create(user=request.user, **serializer.validated_data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        try:
            budget = Budget.objects.get(user=request.user)
           
            serializer = BudgetSerializer(budget, data=request.data, partial=True)
            if serializer.is_valid():
                print("Serializer is valid. Saving...")
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            print("Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

      
        except Budget.DoesNotExist:
            print("No budget found for user.")
            return Response({"error": "No budget found for the user."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            print("Unexpected error:", str(e))
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)     


class EmergencyFundView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            print("Getter Called")
            fund = EmergencyFund.objects.filter(user=request.user).first()
            print("Data: ", fund)
            serializer = EmergencyFundSerializer(fund)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except EmergencyFund.DoesNotExist:
            return Response({"error": "No emergency fund found."}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        serializer = EmergencyFundSerializer(data=request.data)
        if serializer.is_valid():
            EmergencyFund.objects.update_or_create(
                user=request.user,
                defaults=serializer.validated_data
            )
            return Response({"message": "Emergency fund goal updated successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EmergencyFundTransactionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        transactions = EmergencyFundTransaction.objects.filter(user=request.user)
        serializer = EmergencyFundTransactionSerializer(transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = EmergencyFundTransactionSerializer(data=request.data)
        if serializer.is_valid():
            EmergencyFundTransaction.objects.create(user=request.user, **serializer.validated_data)
            return Response({"message": "Transaction recorded successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class EmergencyFundIDView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        emergency_fund = EmergencyFund.objects.filter(user=request.user).first()

        if not emergency_fund:
            return Response({"error": "No emergency fund found."}, status=status.HTTP_404_NOT_FOUND)

        return Response({"emergency_fund_id": emergency_fund.id}, status=status.HTTP_200_OK)
    


class IncomeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user_income = AnnualIncome.objects.filter(user=request.user)
            total_income = sum(income.amount for income in user_income)
            return Response({"total_income": total_income}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


#Goals views
        

class GoalView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        goals = Goal.objects.filter(user=request.user)
        serializer = GoalSerializer(goals, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        data["user"] = request.user.id  # Ensure user is linked
        serializer = GoalSerializer(data=data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, goal_id):
        try:
            goal = Goal.objects.get(id=goal_id, user=request.user)
            serializer = GoalSerializer(goal, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Goal.DoesNotExist:
            return Response({"error": "Goal not found."}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, goal_id):
        try:
            goal = Goal.objects.get(id=goal_id, user=request.user)
            goal.delete()
            return Response({"message": "Goal deleted successfully."}, status=status.HTTP_200_OK)
        except Goal.DoesNotExist:
            return Response({"error": "Goal not found."}, status=status.HTTP_404_NOT_FOUND)
 

class LoanView(APIView): 
    permission_classes = [IsAuthenticated]

    def get(self, request): 
        loans = Loan.objects.filter(user=request.user)
        serializer = LoanSerializer(loans, many=True)
        return Response(serializer.data)
    
    def post(self, request): 
        serializer = LoanSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        print(serializer.errors)
        return Response(serializer.errors, status=400)


class LoanDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return Loan.objects.get(pk=pk, user=user)
        except Loan.DoesNotExist:
            return None

    def put(self, request, pk):
        loan = self.get_object(pk, request.user)
        if not loan:
            return Response({"error": "Loan not found."}, status=404)

        serializer = LoanSerializer(loan, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        loan = self.get_object(pk, request.user)
        if not loan:
            return Response({"error": "Loan not found."}, status=404)

        loan.delete()
        return Response({"message": "Loan deleted successfully."}, status=200)

class CreditCardDebtView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request): 
        cards = CreditCardDebt.objects.filter(user=request.user)
        serializer = CreditCardDebtSerializer(cards, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = CreditCardDebtSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class CreditCardDebtDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return CreditCardDebt.objects.get(pk=pk, user=user)
        except CreditCardDebt.DoesNotExist:
            return None

    def put(self, request, pk):
        card = self.get_object(pk, request.user)
        if not card:
            return Response({"error": "Credit card debt not found."}, status=404)

        serializer = CreditCardDebtSerializer(card, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        card = self.get_object(pk, request.user)
        if not card:
            return Response({"error": "Credit card debt not found."}, status=404)

        card.delete()
        return Response({"message": "Debt deleted successfully."}, status=200)

class MortgageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        mortgages = Mortgage.objects.filter(user=request.user)
        serializer = MortgageSerializer(mortgages, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = MortgageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class MortgageDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return Mortgage.objects.get(pk=pk, user=user)
        except Mortgage.DoesNotExist:
            return None

    def put(self, request, pk):
        mortgage = self.get_object(pk, request.user)
        if not mortgage:
            return Response({"error": "Mortgage not found."}, status=404)

        serializer = MortgageSerializer(mortgage, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        mortgage = self.get_object(pk, request.user)
        if not mortgage:
            return Response({"error": "Mortgage not found."}, status=404)

        mortgage.delete()
        return Response({"message": "Mortgage deleted successfully."}, status=200)


class AddDebtTransactionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = DebtTransactionHistorySerializer(data=request.data)
        if serializer.is_valid():
            liability_type = serializer.validated_data.get("liability_type")
            amount = serializer.validated_data.get("amount")

            if liability_type == "loan":
                liability = serializer.validated_data.get("loan")
            elif liability_type == "credit_card_debt":
                liability = serializer.validated_data.get("credit_card_debt")
            elif liability_type == "mortgage":
                liability = serializer.validated_data.get("mortgage")
            else:
                return Response({"error": "Invalid liability type."}, status=400)

            # Update remaining balance
            if liability:
                liability.remaining_balance = (liability.remaining_balance or 0) - amount
                liability.save()

            serializer.save(user=request.user)
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)
    
class LiabilitiesSummaryView(APIView):
    permission_classes = [IsAuthenticated]
    print("Ohhh yeahhhh")
    def get(self, request):
        loans = Loan.objects.filter(user=request.user)
        cards = CreditCardDebt.objects.filter(user=request.user)
        mortgages = Mortgage.objects.filter(user=request.user)

        total_loans = sum([l.remaining_balance or 0 for l in loans])
        total_cards = sum([c.remaining_balance or 0 for c in cards])
        total_mortgages = sum([m.remaining_balance or 0 for m in mortgages])

        total_liabilities = total_loans + total_cards + total_mortgages

        return Response({
            "loan_balance": total_loans,
            "credit_card_balance": total_cards,
            "mortgage_balance": total_mortgages,
            "total_liabilities": total_liabilities
        })
    

class GetAllLiabilities(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get(self, request, format=None):
        # Fetch all liabilities for each type
        loans = Loan.objects.all()
        credit_card_debts = CreditCardDebt.objects.all()
        mortgages = Mortgage.objects.all()
        
        # Serialize the data
        loan_serializer = LoanSerializer(loans, many=True)
        credit_card_debt_serializer = CreditCardDebtSerializer(credit_card_debts, many=True)
        mortgage_serializer = MortgageSerializer(mortgages, many=True)
        
        # Combine all the data in a single response
        data = {
            'loans': loan_serializer.data,
            'credit_card_debts': credit_card_debt_serializer.data,
            'mortgages': mortgage_serializer.data
        }
        
        return Response(data, status=status.HTTP_200_OK)
    
class RetirementPlanView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Retrieve the retirement plan for the logged-in user."""
        try:
            # Retrieve the retirement plan for the logged-in user
            retirement_plan = RetirementPlan.objects.get(user=request.user)
            
            # Serialize the retirement plan data
            serializer = RetirementPlanSerializer(retirement_plan)

            # Return the retirement plan data
            return Response(serializer.data, status=status.HTTP_200_OK)

        except RetirementPlan.DoesNotExist:
            # If the retirement plan doesn't exist for the user
            return Response({"detail": "Retirement plan not found."}, status=status.HTTP_404_NOT_FOUND)
        
    def post(self, request):
        print("IN POST FUNCTION")
        """Create a retirement plan."""
        serializer = RetirementPlanSerializer(data=request.data)
        
        if serializer.is_valid():
            
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        """Update an existing plan."""
        try:
            plan = RetirementPlan.objects.get(user=request.user)
        except RetirementPlan.DoesNotExist:
            return Response({"error": "Retirement plan not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = RetirementPlanSerializer(plan, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        """Delete an existing plan."""
        try:
            plan = RetirementPlan.objects.get(user=request.user)
            plan.delete()
            return Response({"message": "Retirement plan deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except RetirementPlan.DoesNotExist:
            return Response({"error": "Retirement plan not found."}, status=status.HTTP_404_NOT_FOUND)


class RetirementContributionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Retrieve the retirement contributions for the logged-in user."""
        retirement_plan = RetirementPlan.objects.filter(user=request.user).first()
        if retirement_plan:
            contributions = RetirementContribution.objects.filter(retirement_plan=retirement_plan)
            serializer = RetirementContributionSerializer(contributions, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Retirement plan not found."}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        """Contribute to retirement plan and update savings."""
        amount = request.data.get("amount_contributed")
        note = request.data.get("note", "")

        try:
            plan = RetirementPlan.objects.get(user=request.user)
        except RetirementPlan.DoesNotExist:
            return Response({"error": "Retirement plan not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            amount = Decimal(amount)
        except:
            return Response({"error": "Invalid contribution amount."}, status=status.HTTP_400_BAD_REQUEST)

        # Update current savings in the plan
        plan.current_savings += amount
        plan.save()

        # Create contribution log
        contribution = RetirementContribution.objects.create(
            user=request.user,
            retirement_plan=plan,
            amount_contributed=amount,
            note=note
        )

        serializer = RetirementContributionSerializer(contribution)
        return Response(serializer.data, status=status.HTTP_201_CREATED)



class AssetAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Retrieve the list of assets for the logged-in user."""
        # Filter assets based on the user
        assets = Asset.objects.filter(user=request.user)

        # Serialize the asset data
        serializer = AssetSerializer(assets, many=True)

        # Return the list of assets
        return Response(serializer.data, status=status.HTTP_200_OK)
