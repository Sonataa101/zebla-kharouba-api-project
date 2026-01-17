# services/llm_service.py
import subprocess

LEGAL_SENTENCE = "For further information, check the legal document below."

def call_llm(prompt: str) -> str:
    """
    Calls a local LLM via Ollama (free, offline).
    """
    result = subprocess.run(
        ["ollama", "run", "llama3:latest"],
        input=prompt,
        capture_output=True,
        text=True,
        encoding='utf-8',  # ← ADD THIS TO FIX ERROR
        errors='replace'
    )
    return result.stdout.strip()



def explain_tax(tax_type, payload, language="en") -> str:
    base_context = """
You are a public finance assistant explaining Tunisian municipal taxes.
You must be clear, neutral, and educational.
Do NOT invent laws.
Explain results only.
"""

    if tax_type == "household":
        content = f"""
Household tax calculation:
Surface: {payload['surface']} m²
Municipality: {payload['municipality']}
Category: {payload['category']}
Service surcharge: {payload['T_percent']*100}%
Final tax: {payload['final_tax']} TND
"""

    elif tax_type == "company":
        content = f"""
Company tax calculation:
Surface: {payload['surface']} m²
Category: {payload['category']}
Municipal surcharge: {payload['T_percent']*100}%
Reference rate: {payload['reference_rate']}
Final tax: {payload['final_tax']} TND
"""

    elif tax_type == "land":
        content = f"""
Land tax calculation:
Surface: {payload['surface']} m²
Urban zone: {payload['zone']}
Rate per m²: {payload['zone_rate']}
Final tax: {payload['final_tax']} TND
"""

    language_instruction = {
        "en": "Explain in English.",
        "fr": "Explique en français.",
        "ar": "اشرح باللغة العربية الفصحى."
    }[language]

    prompt = f"""
{base_context}

{language_instruction}

{content}

End the explanation with:
"{LEGAL_SENTENCE}"
"""

    return call_llm(prompt)
