---
"lambda-toolkit": patch
---

Fixed `aws.athena.query` ignoring `maxResults` when `recursive` is `true`; it is now used as the page size of every request.
