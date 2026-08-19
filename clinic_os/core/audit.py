"""Audit logging for compliance and accountability"""

from datetime import datetime
from enum import Enum
from typing import Optional, Dict, Any
import json
import logging
import uuid

logger = logging.getLogger(__name__)


class AuditAction(str, Enum):
    """Audit action types"""
    CHECKIN_CREATED = "CHECKIN_CREATED"
    CHECKIN_UPDATED = "CHECKIN_UPDATED"
    APPOINTMENT_CREATED = "APPOINTMENT_CREATED"
    APPOINTMENT_UPDATED = "APPOINTMENT_UPDATED"
    REPORT_APPROVED = "REPORT_APPROVED"
    REPORT_DELIVERED = "REPORT_DELIVERED"
    AI_BRIEF_GENERATED = "AI_BRIEF_GENERATED"
    AI_BRIEF_VIEWED = "AI_BRIEF_VIEWED"
    QUEUE_ENTRY_CREATED = "QUEUE_ENTRY_CREATED"
    QUEUE_ACTION = "QUEUE_ACTION"
    FOLLOWUP_SENT = "FOLLOWUP_SENT"
    PATIENT_CONSENT_RECORDED = "PATIENT_CONSENT_RECORDED"


async def write_audit_log(
    session,
    clinic_id: str,
    action: AuditAction,
    resource_type: str,
    resource_id: str,
    user_id: Optional[str] = None,
    details: Optional[Dict[str, Any]] = None,
    status: str = "success",
):
    """
    Write an audit log entry

    Args:
        session: Database session
        clinic_id: Clinic identifier
        action: Action type
        resource_type: Type of resource being acted upon
        resource_id: ID of resource
        user_id: User performing the action
        details: Additional details about the action
        status: Status of the action (success, failure)
    """
    # Import here to avoid circular imports
    from clinic_os.modules.checkin.models import AuditLog

    audit_entry = AuditLog(
        id=str(uuid.uuid4()),
        clinic_id=clinic_id,
        action=action.value,
        resource_type=resource_type,
        resource_id=resource_id,
        user_id=user_id,
        details=details or {},
        status=status,
        timestamp=datetime.utcnow(),
    )

    try:
        session.add(audit_entry)
        await session.flush()
        logger.info(
            f"Audit logged - Action: {action.value}, Resource: {resource_type}/{resource_id}, "
            f"Clinic: {clinic_id}, Status: {status}"
        )
    except Exception as e:
        logger.error(f"Failed to write audit log: {str(e)}")
        # Don't raise - audit logging failure shouldn't block the operation
