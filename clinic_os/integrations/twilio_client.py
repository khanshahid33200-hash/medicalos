"""Twilio SMS/WhatsApp integration"""

from twilio.rest import Client
from clinic_os.config import settings
import logging
from typing import Optional

logger = logging.getLogger(__name__)


class TwilioClient:
    """Twilio SMS and WhatsApp client"""

    def __init__(self):
        self.client = Client(settings.twilio_account_sid, settings.twilio_auth_token)
        self.phone_number = settings.twilio_phone_number
        self.whatsapp_number = settings.twilio_whatsapp_number

    async def send_sms(self, to_number: str, message: str) -> Optional[str]:
        """Send SMS message"""
        try:
            msg = self.client.messages.create(
                body=message,
                from_=self.phone_number,
                to=to_number,
            )
            logger.info(f"SMS sent to {to_number}: {msg.sid}")
            return msg.sid
        except Exception as e:
            logger.error(f"Failed to send SMS: {str(e)}")
            return None

    async def send_whatsapp(self, to_number: str, message: str) -> Optional[str]:
        """Send WhatsApp message"""
        try:
            msg = self.client.messages.create(
                body=message,
                from_=f"whatsapp:{self.whatsapp_number}",
                to=f"whatsapp:{to_number}",
            )
            logger.info(f"WhatsApp sent to {to_number}: {msg.sid}")
            return msg.sid
        except Exception as e:
            logger.error(f"Failed to send WhatsApp: {str(e)}")
            return None

    async def send_whatsapp_template(
        self,
        to_number: str,
        template_name: str,
        variables: dict,
    ) -> Optional[str]:
        """Send WhatsApp message using a template"""
        # TODO: Implement template support
        pass


# Global instance
twilio_client = TwilioClient()
