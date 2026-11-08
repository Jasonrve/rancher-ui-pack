<template>
  <span
    v-if="links.length"
    class="workload-links"
  >
    <a
      v-for="link in links"
      :key="`${link.url}-${link.label}`"
      class="workload-link"
      :href="link.url"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="link.label"
      :title="link.label"
    >
      <i
        :class="['icon', link.icon]"
        aria-hidden="true"
      />
      <span>{{ link.label }}</span>
    </a>
  </span>
  <span v-else />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { parseWorkloadLinks } from '../workloadLinks';

const props = defineProps<{ value?: string }>();
const links = computed(() => parseWorkloadLinks(props.value));
</script>

<style scoped>
.workload-links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap-sm, 8px);
}

.workload-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}
</style>
