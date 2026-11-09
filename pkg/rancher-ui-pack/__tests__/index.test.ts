import { IPlugin } from '@shell/core/types';
import extension from '../index';
import packageJson from '../package.json';

/**
 * Stands in for the dashboard's extension manager.
 *
 * Any method your index.ts calls - addProduct, addRoutes, addPanel, addTableColumn, ... - is
 * answered with a jest mock the first time it is read, so this keeps working as you register
 * more things. Assert against them with `expect(plugin.addProduct).toHaveBeenCalledWith(...)`.
 */
const mockPlugin = (): IPlugin => {
  const mocks: Record<string | symbol, unknown> = {};

  return new Proxy({} as Record<string | symbol, unknown>, {
    get(target, prop) {
      if (prop in target) {
        return target[prop];
      }

      mocks[prop] = mocks[prop] || jest.fn();

      return mocks[prop];
    }
  }) as unknown as IPlugin;
};

describe('extension entry point', () => {
  it('should expose the package.json metadata to the dashboard', () => {
    const plugin = mockPlugin();

    extension(plugin);

    expect(plugin.metadata).toStrictEqual(packageJson);
  });

  it('registers the workload Links column for fully qualified Rancher resource IDs', () => {
    const plugin = mockPlugin();

    extension(plugin);

    expect(plugin.addTableColumn).toHaveBeenCalledWith(
      'resource-list',
      { resource: ['pod', 'apps.deployment', 'apps.daemonset', 'apps.statefulset', 'batch.job', 'batch.cronjob'] },
      expect.objectContaining({
        name:      'rancher-ui-pack-workload-links',
        labelKey:  'rancher-ui-pack.table.links',
        formatter: 'WorkloadLinks',
      })
    );
  });
});
