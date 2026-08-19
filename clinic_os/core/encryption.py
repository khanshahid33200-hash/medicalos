"""Field-level encryption for sensitive data"""

from cryptography.fernet import Fernet
from clinic_os.config import settings
import logging

logger = logging.getLogger(__name__)


class EncryptionManager:
    """Handles encryption/decryption of PHI-sensitive fields"""

    def __init__(self, key: str = settings.encryption_key):
        """Initialize with encryption key"""
        try:
            # Ensure the key is properly formatted
            if isinstance(key, str):
                key = key.encode()
            self.cipher = Fernet(key)
        except Exception as e:
            logger.error(f"Failed to initialize encryption: {str(e)}")
            raise

    def encrypt(self, plaintext: str) -> str:
        """Encrypt a string"""
        if not plaintext:
            return plaintext
        try:
            encrypted = self.cipher.encrypt(plaintext.encode())
            return encrypted.decode()
        except Exception as e:
            logger.error(f"Encryption failed: {str(e)}")
            raise

    def decrypt(self, ciphertext: str) -> str:
        """Decrypt a string"""
        if not ciphertext:
            return ciphertext
        try:
            decrypted = self.cipher.decrypt(ciphertext.encode())
            return decrypted.decode()
        except Exception as e:
            logger.error(f"Decryption failed: {str(e)}")
            raise


# Global encryption manager instance
encryption_manager = EncryptionManager()
