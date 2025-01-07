from django.urls import path
from .views import Signup, VerifyEmail, UserLogin, SaveUserData

urlpatterns = [
    path("signup/", Signup.as_view(), name="signup"),  # Signup endpoint
    path("verify-email/", VerifyEmail.as_view(), name="verify-email"),  # Email verification
    path("login/", UserLogin.as_view(), name="login"),  # Login endpoint
    path("save-user-data/", SaveUserData.as_view(), name="save-user-data"),  # Login endpoint

]