from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.conf import settings
from django.urls import reverse
from .models import Liability, Asset, AnnualIncome, Expense, PersonalDetails

import logging
logger = logging.getLogger(__name__)
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
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
    def post(self, request):
        user = request.user  # Get the authenticated user
        data = request.data

        # Save Personal Details
        personal_data = data.get("personalDetails", {})
        PersonalDetails.objects.create(
            user=user,
            age=personal_data.get("age"),
            marital_status=personal_data.get("maritalStatus"),
            number_of_children=personal_data.get("numberOfChildren")
        )

        # Save Annual Income
        for income in data.get("annualIncome", []):
            AnnualIncome.objects.create(
                user=user,
                category=income.get("category"),
                frequency=income.get("frequency"),
                amount=income.get("amount"),
                description=income.get("description"),
                currency=income.get("currency", "PKR")
            )

        # Save Assets
        for asset in data.get("assets", []):
            Asset.objects.create(
                user=user,
                category=asset.get("category"),
                description=asset.get("description"),
                amount=asset.get("amount"),
                currency=asset.get("currency", "PKR")
            )

        # Save Liabilities
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

