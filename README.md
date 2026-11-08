# Rancher UI Pack

A Rancher UI extension that adds a **Links** column to workload resource tables. Each row reads its own links from a Kubernetes workload annotation, so no operator, CRD, or cluster-side installation is required.

Compatibility target: Rancher Dashboard v2.10.2 (verified UI bundle); the API capability used, resource-table columns, was introduced in Rancher v2.7.2. The backend Rancher server version still needs authenticated confirmation during installation. The extension uses the Rancher UI extension manager v3 package format.

## Configure workload links

Set `ui-pack.rancher.io/links` in the workload's `metadata.annotations`. The annotation value is a JSON array; each item requires a visible `label`, an HTTP(S) `url`, and an icon class/name `icon` supported by Rancher's icon font.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: storefront
  annotations:
    ui-pack.rancher.io/links: '[{"label":"Logs","url":"https://logs.example.com/storefront","icon":"icon icon-logs"},{"label":"Metrics","url":"https://metrics.example.com/storefront","icon":"icon icon-line-chart"}]'
```

Links open in a new tab with `noopener noreferrer`. Invalid JSON, non-HTTP(S) URLs, incomplete entries, overlong annotations, and entries beyond the first 10 are ignored. The annotation must be present on the resource shown in a table (e.g. directly on a Pod when viewing Pods; a Deployment annotation does not automatically propagate to its ReplicaSet/Pods).

## Build and test

The upstream Rancher extension builder currently requires Node.js 24 or newer. Use a supported Node release, then install dependencies using the repository's Yarn lockfile/configuration.

```sh
yarn install --frozen-lockfile
yarn lint
yarn test:ci
yarn build-pkg rancher-ui-pack
```

The package output is generated under `dist-pkg/` and can be served with `yarn serve-pkgs` for installation in Rancher. This repository does not deploy anything to a Rancher cluster.

## Install

1. Build the package as above.
2. Host the generated extension package through an HTTPS endpoint reachable by Rancher.
3. In Rancher, open **Extensions** and add the hosted extension package/catalog source using the Rancher UI Extensions v3 workflow.
4. Install **Rancher UI Pack** and reload the dashboard. The Links column appears in Pod, Deployment, DaemonSet, StatefulSet, Job, and CronJob resource tables; rows without valid annotations remain empty.

No deployment manifest or Helm chart is needed: this is a browser-side Rancher UI extension, not a cluster workload. Do not install until Platform confirms the live server version and package source policy.
