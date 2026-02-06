## 2025-05-14 - Price Tampering via DOM Manipulation
**Vulnerability:** Business-critical values like total price were being read directly from the DOM (`textContent`) during form submission, allowing users to easily tamper with the booking cost.
**Learning:** Even in static sites, client-side 'source of truth' constants should be used to re-calculate all sensitive values at the moment of submission.
**Prevention:** Never trust data stored in visible DOM elements for business logic or final submissions. Use an internal data structure and recalculate.
