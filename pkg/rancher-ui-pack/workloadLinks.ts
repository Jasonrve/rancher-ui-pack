export interface WorkloadLink {
  label: string;
  url: string;
  icon: string;
}

export const WORKLOAD_LINKS_ANNOTATION = 'ui-pack.rancher.io/links';
const MAX_LINKS = 10;

/** Parse links from a workload annotation, accepting only safe HTTP(S) destinations. */
export function parseWorkloadLinks(raw?: string): WorkloadLink[] {
  if (!raw || raw.length > 8192) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.slice(0, MAX_LINKS).flatMap((entry: unknown) => {
      if (!entry || typeof entry !== 'object') {
        return [];
      }

      const candidate = entry as Record<string, unknown>;
      const label = typeof candidate.label === 'string' ? candidate.label.trim() : '';
      const url = typeof candidate.url === 'string' ? candidate.url.trim() : '';
      const icon = typeof candidate.icon === 'string' ? candidate.icon.trim() : '';

      if (!label || label.length > 100 || !url || url.length > 2048 || !icon || icon.length > 80) {
        return [];
      }

      try {
        const destination = new URL(url);

        if (destination.protocol !== 'https:' && destination.protocol !== 'http:') {
          return [];
        }
      } catch {
        return [];
      }

      return [{
        label, url, icon
      }];
    });
  } catch {
    return [];
  }
}
