---
"lambda-toolkit": patch
---

Fixed `aws.athena.query` dropping the first row of every result page after the first, both with `recursive: true` and when paginating with `paginationToken`.
