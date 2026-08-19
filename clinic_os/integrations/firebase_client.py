"""Firebase Admin SDK Integration for project gen-lang-client-0247041905"""

import logging
import os
from typing import Optional
import firebase_admin
from firebase_admin import credentials, firestore, auth, storage, db
from clinic_os.config import settings

logger = logging.getLogger(__name__)


class FirebaseClient:
    """Firebase integration wrapper for Clinic OS"""

    def __init__(self):
        self._app: Optional[firebase_admin.App] = None

    def initialize(self) -> Optional[firebase_admin.App]:
        """Initialize Firebase Admin App"""
        if firebase_admin._apps:
            self._app = firebase_admin.get_app()
            return self._app

        try:
            cred = None
            if settings.firebase_credentials_path and os.path.exists(settings.firebase_credentials_path):
                cred = credentials.Certificate(settings.firebase_credentials_path)
            elif os.getenv("GOOGLE_APPLICATION_CREDENTIALS") and os.path.exists(os.getenv("GOOGLE_APPLICATION_CREDENTIALS")):
                cred = credentials.Certificate(os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))
            else:
                try:
                    cred = credentials.ApplicationDefault()
                except Exception:
                    cred = None

            options = {
                'projectId': settings.firebase_project_id,
                'storageBucket': settings.firebase_storage_bucket,
                'databaseURL': settings.firebase_database_url,
            }

            if cred:
                self._app = firebase_admin.initialize_app(cred, options)
            else:
                self._app = firebase_admin.initialize_app(options=options)

            logger.info(f"Firebase initialized successfully for project: {settings.firebase_project_id}")
            return self._app
        except Exception as e:
            logger.warning(f"Firebase initialization info ({settings.firebase_project_id}): {e}")
            try:
                options = {'projectId': settings.firebase_project_id}
                self._app = firebase_admin.initialize_app(options=options)
                return self._app
            except Exception as ex:
                logger.error(f"Failed to initialize Firebase app: {ex}")
                return None

    def get_firestore(self):
        """Get Firestore client"""
        if not self._app:
            self.initialize()
        return firestore.client(app=self._app) if self._app else None

    def get_auth(self):
        """Get Auth instance"""
        if not self._app:
            self.initialize()
        return auth

    def get_storage_bucket(self):
        """Get Storage bucket"""
        if not self._app:
            self.initialize()
        return storage.bucket(app=self._app) if self._app else None

    def get_status(self) -> dict:
        """Get current Firebase configuration status"""
        return {
            "project_id": settings.firebase_project_id,
            "auth_domain": settings.firebase_auth_domain,
            "storage_bucket": settings.firebase_storage_bucket,
            "database_url": settings.firebase_database_url,
            "initialized": bool(firebase_admin._apps),
            "app_name": self._app.name if self._app else None,
        }


firebase_client = FirebaseClient()
