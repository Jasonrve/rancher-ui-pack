# Rancher UI Pack 0.1.1

## Fix: Deployment Links column not registered

Rancher UI Pack 0.1.0 targeted workloads with bare resource names (for example, `deployment`). Since Rancher 2.8, table-column `LocationConfig.resource` matches Kubernetes resource IDs; the Rancher 2.10.x Deployment route uses `apps.deployment`. The selector therefore did not match the Deployment ResourceTable, so the Links column was never registered there. This is the leading source-level root cause based on the published Rancher v2 extension API contract; the exact Dashboard v2.10.2 runtime source was not independently inspected.

The 0.1.1 source now selects fully qualified IDs for grouped API resources (`apps.deployment`, `apps.daemonset`, `apps.statefulset`, `batch.job`, `batch.cronjob`) while preserving the core/v1 `pod` identifier and the existing `ui-pack.rancher.io/links` annotation contract. A regression test asserts the exact resource-list registration and column metadata. No cluster was modified.

## Verification

See the release task handoff for lint, test, build, artifact SHA256, commit, and remote publication results.
