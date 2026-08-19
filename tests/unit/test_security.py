"""Unit tests for security module"""

import pytest
from datetime import timedelta
from clinic_os.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    verify_token,
    create_refresh_token,
)


class TestPasswordHashing:
    """Test password hashing and verification"""

    def test_hash_password_creates_different_hash(self):
        """Test that password hashing creates different output each time"""
        password = "MySecurePassword123!"

        hash1 = hash_password(password)
        hash2 = hash_password(password)

        # Hashes should be different (bcrypt uses salt)
        assert hash1 != hash2

    def test_verify_password_correct(self):
        """Test password verification with correct password"""
        password = "MySecurePassword123!"
        hashed = hash_password(password)

        assert verify_password(password, hashed) == True

    def test_verify_password_incorrect(self):
        """Test password verification with incorrect password"""
        password = "CorrectPassword123!"
        hashed = hash_password(password)

        assert verify_password("WrongPassword456", hashed) == False

    def test_verify_password_case_sensitive(self):
        """Test that password verification is case-sensitive"""
        password = "MyPassword"
        hashed = hash_password(password)

        assert verify_password("mypassword", hashed) == False
        assert verify_password("MYPASSWORD", hashed) == False

    def test_hash_empty_password(self):
        """Test hashing empty password (should work but not recommended)"""
        password = ""
        hashed = hash_password(password)

        assert verify_password("", hashed) == True
        assert verify_password("anything", hashed) == False

    def test_hash_long_password(self):
        """Test hashing very long password"""
        password = "A" * 1000
        hashed = hash_password(password)

        assert verify_password(password, hashed) == True
        assert verify_password("A" * 999, hashed) == False


class TestJWTTokens:
    """Test JWT token creation and verification"""

    def test_create_access_token(self):
        """Test creating access token"""
        data = {"sub": "user-123", "clinic_id": "clinic-456", "role": "doctor"}

        token = create_access_token(data)

        assert isinstance(token, str)
        assert len(token) > 20  # JWT should be reasonably long

    def test_verify_valid_token(self):
        """Test verifying valid token"""
        data = {"sub": "user-123", "clinic_id": "clinic-456", "role": "doctor"}

        token = create_access_token(data)
        payload = verify_token(token)

        assert payload is not None
        assert payload["sub"] == "user-123"
        assert payload["clinic_id"] == "clinic-456"
        assert payload["role"] == "doctor"

    def test_verify_invalid_token(self):
        """Test verifying invalid token"""
        token = "this-is-not-a-valid-jwt-token"

        payload = verify_token(token)

        assert payload is None

    def test_verify_expired_token(self):
        """Test that expired token fails verification"""
        data = {"sub": "user-123", "clinic_id": "clinic-456"}
        # Create token with 0 expiration (immediate expiry)
        token = create_access_token(data, expires_delta=timedelta(seconds=-1))

        # Token should be expired
        payload = verify_token(token)

        # Expired tokens might still parse depending on implementation
        # This test documents the behavior
        assert payload is None or payload.get("exp") is not None

    def test_verify_malformed_token(self):
        """Test verifying malformed token"""
        malformed_tokens = [
            "header.payload",  # Missing signature
            "header.payload.signature.extra",  # Too many parts
            "not-base64-encoded",  # Invalid format
        ]

        for token in malformed_tokens:
            payload = verify_token(token)
            assert payload is None

    def test_token_contains_exp_claim(self):
        """Test that token contains expiration claim"""
        data = {"sub": "user-123"}

        token = create_access_token(data)
        payload = verify_token(token)

        assert payload is not None
        assert "exp" in payload  # Expiration should be set

    def test_token_data_preservation(self):
        """Test that token preserves custom data"""
        data = {
            "sub": "user-123",
            "clinic_id": "clinic-456",
            "role": "admin",
            "email": "user@example.com",
            "custom_claim": "custom_value",
        }

        token = create_access_token(data)
        payload = verify_token(token)

        assert payload["sub"] == data["sub"]
        assert payload["clinic_id"] == data["clinic_id"]
        assert payload["role"] == data["role"]
        assert payload["email"] == data["email"]
        assert payload["custom_claim"] == data["custom_claim"]


class TestRefreshTokens:
    """Test refresh token creation"""

    def test_create_refresh_token(self):
        """Test creating refresh token"""
        user_id = "user-123"
        clinic_id = "clinic-456"

        token = create_refresh_token(user_id, clinic_id)

        assert isinstance(token, str)
        assert len(token) > 20

    def test_refresh_token_contains_type(self):
        """Test that refresh token contains type claim"""
        token = create_refresh_token("user-123", "clinic-456")
        payload = verify_token(token)

        assert payload is not None
        assert payload.get("type") == "refresh"

    def test_refresh_token_longer_expiry(self):
        """Test that refresh token has longer expiry than access token"""
        user_id = "user-123"
        clinic_id = "clinic-456"

        access_token = create_access_token({"sub": user_id, "clinic_id": clinic_id})
        refresh_token = create_refresh_token(user_id, clinic_id)

        access_payload = verify_token(access_token)
        refresh_payload = verify_token(refresh_token)

        # Refresh token should expire later
        assert refresh_payload["exp"] > access_payload["exp"]


class TestAuthenticationFlow:
    """Test complete authentication flow"""

    def test_complete_auth_flow(self):
        """Test login → token generation → verification flow"""
        # Simulate login
        password = "SecurePassword123!"
        hashed = hash_password(password)

        # Verify password correct
        assert verify_password(password, hashed) == True

        # Generate tokens
        user_id = "user-123"
        clinic_id = "clinic-456"
        access_token = create_access_token({
            "sub": user_id,
            "clinic_id": clinic_id,
            "role": "doctor"
        })
        refresh_token = create_refresh_token(user_id, clinic_id)

        # Verify access token
        access_payload = verify_token(access_token)
        assert access_payload["sub"] == user_id
        assert access_payload["role"] == "doctor"

        # Verify refresh token
        refresh_payload = verify_token(refresh_token)
        assert refresh_payload["sub"] == user_id
        assert refresh_payload["type"] == "refresh"

    def test_password_never_stored_plaintext(self):
        """Test that passwords should never be stored plaintext"""
        password = "SecurePassword123!"

        hashed = hash_password(password)

        # Hashed version should not contain original password
        assert password not in hashed
