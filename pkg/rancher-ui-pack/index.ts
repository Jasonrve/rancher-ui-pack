import { importTypes } from '@rancher/auto-import';
import { IPlugin, TableColumnLocation } from '@shell/core/types';

// Init the package
export default function(plugin: IPlugin): void {
  // Auto-import model, detail, edit from the folders
  importTypes(plugin);

  // Provide plugin metadata from package.json
  plugin.metadata = require('./package.json');

  // Rancher 2.7.2+ ResourceTable API; match all common workload kinds.
  plugin.addTableColumn(
    TableColumnLocation.RESOURCE,
    { resource: ['pod', 'deployment', 'daemonset', 'statefulset', 'job', 'cronjob'] },
    {
      name:      'rancher-ui-pack-workload-links',
      labelKey:  'rancher-ui-pack.table.links',
      formatter: 'WorkloadLinks',
      getValue:  (row: { metadata?: { annotations?: Record<string, string> } }) => row.metadata?.annotations?.['ui-pack.rancher.io/links'] || '',
    }
  );
}
