---
'hr-web': patch
---

Numeric fields in the employee forms accept digits only, and the create-employee payload is built in one place so an empty NIP or NUPTK falls back to the next identifier. The kiosk keeps offline scan times honest: a scan is sent first and queued only when the server clock anchor is still usable, otherwise it is refused with a clear message, and a queue write failure is reported instead of lost. Adds tests for the kiosk queue, the server clock, the kiosk view and employee creation, and removes an assertion that only restated its fixture. The Vite dev server pre-bundles the Unovis `striptags` dependency.
