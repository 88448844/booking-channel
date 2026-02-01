## 2025-05-22 - Data Integrity and Price Tampering
**Vulnerability:** Client-side price tampering by modifying the DOM before form submission.
**Learning:** In a pure client-side application, business logic (like price calculation) that relies on values pulled from the DOM is easily exploitable. Even if the data is ultimately sent via email, it can lead to confusion or successful exploitation if the receiver does not re-verify the price.
**Prevention:** Use a hardcoded, trusted source of truth (like a JS constant) for all rates and names. Recalculate all totals in the submit handler from raw validated inputs rather than trusting displayed text content.
