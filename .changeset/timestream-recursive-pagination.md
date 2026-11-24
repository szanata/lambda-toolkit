---
"lambda-toolkit": patch
---

Fixed `aws.timestreamQuery.query` with `recursive: true` returning only the last two pages of results when a query spans more than two pages.
