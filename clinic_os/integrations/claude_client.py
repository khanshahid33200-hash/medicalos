"""Anthropic Claude API integration for AI triage"""

import anthropic
import json
from clinic_os.config import settings
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)


class TriageBriefUnavailable(Exception):
    """Raised when Claude API fails or is unavailable"""
    pass


class ClaudeClient:
    """Claude API client for triage brief generation"""

    def __init__(self):
        self.client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
        self.model = settings.claude_model

    async def generate_triage_brief(self, checkin_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate AI-assisted triage brief for doctor review

        Args:
            checkin_data: Check-in form data

        Returns:
            Structured triage brief with differential considerations, urgency flags, etc.
        """
        system_prompt = """You are a clinical triage support assistant for a clinic.
You are given a patient's self-reported intake data. Produce a structured JSON brief
for the treating doctor only — this is decision support, never a diagnosis, and must
never be shown to the patient.

Flag urgency conservatively; when in doubt, flag it as at least 'low' and let the
clinician decide.

IMPORTANT: Your response MUST be valid JSON that can be parsed."""

        user_message = f"""Please analyze this patient intake and provide a triage brief:

{json.dumps(checkin_data, indent=2)}

Respond with ONLY a JSON object (no markdown, no extra text) with these fields:
{{
  "summary_text": "Brief 1-2 sentence summary of chief complaint",
  "differential_considerations": [
    {{"condition": "Condition name", "confidence": "low|medium|high", "notes": "why this is being considered"}}
  ],
  "urgency_flag": "none|low|high",
  "urgency_reason": "Explanation for urgency flag",
  "suggested_questions": ["Question 1", "Question 2", ...],
  "history_flags": {{
    "allergies": ["Allergy 1", ...],
    "drug_interactions": ["Interaction 1", ...],
    "prior_diagnoses": ["Diagnosis 1", ...]
  }},
  "ai_disclaimer": "AI-generated triage support — not a diagnosis. For clinician review only."
}}"""

        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=1000,
                system=system_prompt,
                messages=[{"role": "user", "content": user_message}],
            )

            # Extract JSON from response
            response_text = response.content[0].text
            brief_data = json.loads(response_text)

            logger.info(f"Triage brief generated successfully")
            return brief_data

        except anthropic.APIError as e:
            logger.error(f"Claude API error: {str(e)}")
            raise TriageBriefUnavailable(f"Claude API unavailable: {str(e)}")
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Claude response as JSON: {str(e)}")
            raise TriageBriefUnavailable(f"Invalid response format: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error generating triage brief: {str(e)}")
            raise TriageBriefUnavailable(f"Error generating brief: {str(e)}")


# Global instance
claude_client = ClaudeClient()
