<script setup lang="ts">
import { useRelayTest } from '@/hooks/useRelayTest'
import { providers } from '@/utils/providers'
import RequestPanel from '@/components/RequestPanel.vue'
import ProviderSelect from '@/components/ProviderSelect.vue'
import ResultCard from '@/components/ResultCard.vue'
import IconEditor from '@/components/icons/IconEditor.vue'
import IconLogo from './components/icons/IconLogo.vue'

const { request, selectedIds, running, results, toggle, runAll } =
  useRelayTest()
</script>

<template>
  <header>
    <h1>
      Token Race
      <IconLogo />
    </h1>
    <div class="header-actions">
      <span class="model-name" :title="request.model">
        {{ request.model }}
      </span>
      <div class="mode-switch" :class="{ stream: request.stream }">
        <button
          type="button"
          class="mode-button"
          :class="{ active: !request.stream }"
          @click="request.stream = false"
        >
          Complete
        </button>
        <button
          type="button"
          class="mode-button"
          :class="{ active: request.stream }"
          @click="request.stream = true"
        >
          Stream
        </button>
      </div>
      <button
        type="button"
        class="edit-request"
        commandfor="request-editor"
        command="show-modal"
      >
        <IconEditor />
      </button>
    </div>
  </header>

  <RequestPanel :request="request" />
  <ProviderSelect
    :providers="providers"
    :selected-ids="selectedIds"
    :running="running"
    @toggle="toggle"
    @run="runAll"
  />

  <section class="results">
    <div class="results-head">
      <h2>Results</h2>
      <span v-if="running">Testing selected providers...</span>
      <span v-else-if="results.length">
        {{ results.length }}
        {{ results.length === 1 ? 'response' : 'responses' }}
      </span>
    </div>

    <div v-if="results.length" class="result-grid">
      <ResultCard v-for="r in results" :key="r.provider.id" :result="r" />
    </div>
    <div v-else class="empty-state">
      {{ running ? 'Waiting for responses...' : 'Run to compare responses.' }}
    </div>
  </section>
</template>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 18px;

  h1 {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 24px;
    font-family: var(--mono);
    margin-block: unset;

    svg {
      width: 24px;
    }
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

.model-name {
  font-size: 0.875rem;
  font-family: var(--mono);
  font-weight: bold;
}

.mode-switch {
  position: relative;
  display: inline-flex;
  width: 146px;
  box-sizing: border-box;
  padding: 2px;
  border: 1px solid var(--color-border);
  border-radius: 16px;

  &::before {
    content: '';
    position: absolute;
    z-index: 0;
    top: 2px;
    bottom: 2px;
    left: 2px;
    width: calc(50% - 2px);
    border-radius: 13px;
    background-color: var(--color-panel);
    box-shadow: 0 1px 4px #00000016;
    pointer-events: none;
    transition: 0.2s;
  }

  &.stream::before {
    transform: translateX(100%);
  }
}

.mode-button {
  position: relative;
  z-index: 1;
  flex: 1;
  padding: 5px 9px;
  border: none;
  background-color: transparent;
  color: var(--color-text);
  cursor: pointer;
  font-size: 12px;

  transition: 0.2s;
  opacity: 0.5;

  &.active {
    opacity: 1;
  }
}

.edit-request {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  background-color: transparent;
  color: var(--color-text);
  cursor: pointer;
  transition: 0.2s;

  svg {
    width: 17px;
    height: 17px;
  }

  &:hover {
    border-color: var(--color-text-secondary);
    background-color: var(--color-panel);
  }
}

.results {
  margin-top: 4px;
}

.results-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;

  h2 {
    margin: 0;
    font-size: 15px;
  }

  span {
    color: var(--color-text-muted);
    font-size: 12px;
  }
}

.result-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.empty-state {
  padding: 42px 20px;
  border: 1px dashed var(--color-border);
  border-radius: 10px;
  color: var(--color-text-muted);
  font-size: 0.75rem;
  text-align: center;
}

@media (max-width: 640px) {
  .wrap {
    padding: 16px;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .model-name {
    max-width: min(220px, calc(100vw - 180px));
  }
}
</style>
