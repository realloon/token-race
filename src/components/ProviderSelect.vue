<script setup lang="ts">
import type { RelayProvider } from '@/types'

defineProps<{
  providers: RelayProvider[]
  selectedIds: string[]
  running: boolean
}>()

const emit = defineEmits<{
  toggle: [id: string]
  run: []
}>()
</script>

<template>
  <section class="provider-bar">
    <div class="provider-group">
      <h2 class="provider-heading">Relay providers</h2>
      <div class="checks">
        <label
          v-for="p in providers"
          :key="p.id"
          class="check"
          :class="{ selected: selectedIds.includes(p.id) }"
        >
          <input
            type="checkbox"
            :checked="selectedIds.includes(p.id)"
            @change="emit('toggle', p.id)"
          />
          <span>{{ p.name }}</span>
        </label>
      </div>
    </div>

    <button
      type="button"
      class="run"
      :disabled="running || !selectedIds.length"
      @click="emit('run')"
    >
      <span>{{ running ? 'Running…' : 'Run All' }}</span>
    </button>
  </section>
</template>

<style scoped>
.provider-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 18px;
}

.provider-group {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
  min-width: 0;
}

.provider-heading {
  flex-shrink: 0;
  margin: 0;
  font-size: 13px;
}

.checks {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.check {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: 12px;
  padding: 3px 0;
  transition: 0.2s;

  &.selected,
  &:hover {
    color: var(--color-text);
  }

  input {
    width: 14px;
    height: 14px;
    margin: 0;
    accent-color: var(--color-primary);
  }

  span {
    user-select: none;
    -webkit-user-select: none;
  }
}

button.run {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-width: 96px;
  height: 32px;
  padding: 0 12px;
  border: none;
  border-radius: 6px;
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  cursor: pointer;
  font: inherit;
  font-size: 0.875rem;
  font-weight: bold;
  flex-shrink: 0;
  transition: 0.2s;

  &:hover:not(:disabled) {
    background: var(--color-text);
  }

  &:disabled {
    background: var(--color-primary-disabled);
    color: var(--color-text-muted);
    cursor: not-allowed;
  }
}

@media (max-width: 640px) {
  .provider-bar {
    align-items: stretch;
    flex-direction: column;
    gap: 12px;
  }

  .provider-group {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  button.run {
    align-self: flex-end;
    min-width: 96px;
  }
}
</style>
