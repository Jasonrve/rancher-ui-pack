import { parseWorkloadLinks, WORKLOAD_LINKS_ANNOTATION } from '../workloadLinks';

describe('parseWorkloadLinks', () => {
  it('parses annotation links with label, URL, and icon', () => {
    expect(parseWorkloadLinks(JSON.stringify([
      {
        label: 'Logs', url: 'https://logs.example.test/app', icon: 'icon icon-logs'
      },
    ]))).toEqual([
      {
        label: 'Logs', url: 'https://logs.example.test/app', icon: 'icon icon-logs'
      },
    ]);
  });

  it('returns no links for missing, malformed, or non-array annotations', () => {
    expect(parseWorkloadLinks()).toEqual([]);
    expect(parseWorkloadLinks('{')).toEqual([]);
    expect(parseWorkloadLinks(JSON.stringify({ url: 'https://example.test' }))).toEqual([]);
  });

  it('rejects unsafe protocols and malformed entries', () => {
    expect(parseWorkloadLinks(JSON.stringify([
      {
        label: 'Bad', url: 'javascript:alert(1)', icon: 'icon-link'
      },
      { label: 'Missing icon', url: 'https://example.test' },
      null,
    ]))).toEqual([]);
  });

  it('limits the annotation size and number of links', () => {
    expect(parseWorkloadLinks('x'.repeat(8193))).toEqual([]);
    const links = Array.from({ length: 12 }, (_, index) => ({
      label: `Link ${ index }`,
      url:   `https://example.test/${ index }`,
      icon:  'icon-link',
    }));

    expect(parseWorkloadLinks(JSON.stringify(links))).toHaveLength(10);
  });

  it('uses the documented annotation key', () => {
    expect(WORKLOAD_LINKS_ANNOTATION).toBe('ui-pack.rancher.io/links');
  });
});
