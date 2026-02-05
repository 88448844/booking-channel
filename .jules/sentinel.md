## 2025-02-05 - [Line Endings and CSP Hashes]
**Vulnerability:** N/A (Security enhancement side effect)
**Learning:** Normalizing line endings (CRLF to LF) in a file with inline scripts and a CSP that uses hashes will change all the script hashes, even if the code logic remains the same. It also causes massive diffs in git.
**Prevention:** Always check for CRLF line endings (using `cat -A`) before applying patches. Use binary-safe or line-ending-aware tools to modify files in repositories that use CRLF.
