"""OCR functionality for paper record digitization"""

import pytesseract
import logging
from PIL import Image
from io import BytesIO
from typing import Optional, Tuple
from clinic_os.config import settings

logger = logging.getLogger(__name__)

# Set tesseract path
pytesseract.pytesseract.pytesseract_cmd = settings.tesseract_path


class OCRProcessor:
    """Process paper records via OCR"""

    @staticmethod
    async def extract_text_from_image(image_data: bytes) -> Tuple[str, int]:
        """
        Extract text from an image using Tesseract OCR

        Args:
            image_data: Image bytes

        Returns:
            Tuple of (extracted_text, confidence_score)
        """
        try:
            image = Image.open(BytesIO(image_data))

            # Extract text
            extracted_text = pytesseract.image_to_string(
                image,
                lang='eng',
                config='--psm 6'  # Assume single uniform block of text
            )

            # Get confidence data (if available)
            data = pytesseract.image_to_data(image, output_type=pytesseract.Output.DICT)
            confidences = [int(conf) for conf in data['confidence'] if int(conf) > 0]
            avg_confidence = sum(confidences) / len(confidences) if confidences else 0

            logger.info(f"OCR extraction complete. Confidence: {avg_confidence}%")
            return extracted_text.strip(), int(avg_confidence)

        except Exception as e:
            logger.error(f"OCR extraction failed: {str(e)}")
            raise

    @staticmethod
    async def extract_structured_data(text: str) -> dict:
        """
        Extract structured fields from OCR'd text

        This uses pattern matching and heuristics to identify common fields.
        In production, this could use Claude API for smarter extraction.

        Returns:
            Dictionary with extracted fields
        """
        # TODO: Implement field extraction logic
        # For now, return placeholder
        return {
            "name": None,
            "age": None,
            "symptoms": text,
            "medical_history": None,
            "allergies": None,
        }

    @staticmethod
    async def validate_document(image_data: bytes) -> bool:
        """
        Validate that image is a readable medical form

        Returns:
            True if image appears to be a valid medical form
        """
        try:
            image = Image.open(BytesIO(image_data))

            # Basic validation
            if image.size[0] < 100 or image.size[1] < 100:
                logger.warning("Image too small")
                return False

            # Check if image has enough text
            text = pytesseract.image_to_string(image)
            if len(text.split()) < 5:
                logger.warning("Not enough text in image")
                return False

            return True

        except Exception as e:
            logger.error(f"Document validation failed: {str(e)}")
            return False
