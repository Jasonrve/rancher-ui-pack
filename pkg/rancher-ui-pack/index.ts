import { importTypes } from '@rancher/auto-import';
import { IPlugin, TableColumnLocation } from '@shell/core/types';

// Init the package
export default function(plugin: IPlugin): void {
  // Auto-import model, detail, edit from the folders
  importTypes(plugin);

  // Provide plugin metadata from package.json
  plugin.metadata = require('./package.json');

  // Rancher 2.8+ ResourceTable API uses Kubernetes resource IDs; match all common workloads.
  plugin.addTableColumn(
    TableColumnLocation.RESOURCE,
    { resource: ['pod', 'apps.deployment', 'apps.daemonset', 'apps.statefulset', 'batch.job', 'batch.cronjob'] },
    {
      name:      'rancher-ui-pack-workload-links',
      labelKey:  'rancher-ui-pack.table.links',
      formatter: 'WorkloadLinks',
      getValue:  (row: { metadata?: { annotations?: Record<string, string> } }) => row.metadata?.annotations?.['ui-pack.rancher.io/links'] || '',
    }
  );
}
