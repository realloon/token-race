<script setup lang="ts">
import { computed, ref } from 'vue'
import { cachedTokensOf, outputTokensPerSecond } from '@/utils/tokens'
import type { TestResult } from '@/types'

const props = defineProps<{ result: TestResult }>()

type ResponseView = 'output_text' | 'usage' | 'raw'

const responseView = ref<ResponseView>('usage')

const outputTokenRate = computed(() =>
  outputTokensPerSecond(
    props.result.usage,
    props.result.latency,
    props.result.timeToFirstToken,
  ),
)

function formatJson(value: unknown) {
  return JSON.stringify(value, null, 2) ?? ''
}

function responseContent() {
  const result = props.result

  if (responseView.value === 'output_text') {
    return result.raw?.output_text ?? result.outputText
  }

  if (responseView.value === 'usage') {
    return formatJson(result.raw?.usage ?? result.usage ?? null)
  }

  return formatJson(result.raw)
}
</script>

<template>
  <div class="card" :class="result.status">
    <div class="card-head">
      <span class="badge" :class="result.status">
        {{
          result.status === 'success'
            ? 'Success'
            : result.status === 'running'
              ? 'Running'
              : 'Failed'
        }}
      </span>
      <div class="card-text">
        <span class="name">{{ result.provider.name }}</span>
        <div class="timings">
          <span v-if="result.timeToFirstToken !== undefined" class="metric">
            TTFT {{ result.timeToFirstToken.toFixed(0) }} ms
          </span>
          <span v-if="outputTokenRate !== undefined" class="metric">
            {{ outputTokenRate.toFixed(1) }} output tok/s
          </span>
          <span class="latency">
            {{
              result.status === 'running'
                ? 'Running…'
                : `Total ${result.latency.toFixed(0)} ms`
            }}
          </span>
        </div>
      </div>
      <span class="mode">{{ result.stream ? 'Stream' : 'Complete' }}</span>
    </div>
    <div v-if="result.status === 'success'" class="tokens">
      <span
        >in: <b>{{ result.usage?.input_tokens ?? '-' }}</b></span
      >
      <span
        >out: <b>{{ result.usage?.output_tokens ?? '-' }}</b></span
      >
      <span
        >cached: <b>{{ cachedTokensOf(result.usage) ?? '-' }}</b></span
      >
    </div>
    <template v-if="result.raw">
      <button
        type="button"
        class="raw-button"
        :commandfor="`raw-response-${result.provider.id}`"
        command="show-modal"
      >
        View response details
      </button>
      <dialog
        :id="`raw-response-${result.provider.id}`"
        class="raw-dialog"
        :aria-labelledby="`raw-response-title-${result.provider.id}`"
      >
        <header class="raw-dialog-header">
          <h2 :id="`raw-response-title-${result.provider.id}`">
            Response details
          </h2>
          <form method="dialog">
            <button type="submit" class="raw-close" value="close">Close</button>
          </form>
        </header>
        <div class="response-content" :class="`view-${responseView}`">
          <div
            class="response-switch"
            role="tablist"
            aria-label="Response view"
          >
            <button
              type="button"
              role="tab"
              :aria-selected="responseView === 'usage'"
              :class="{ active: responseView === 'usage' }"
              @click="responseView = 'usage'"
            >
              usage
            </button>
            <button
              type="button"
              role="tab"
              :aria-selected="responseView === 'output_text'"
              :class="{ active: responseView === 'output_text' }"
              @click="responseView = 'output_text'"
            >
              output_text
            </button>
            <button
              type="button"
              role="tab"
              :aria-selected="responseView === 'raw'"
              :class="{ active: responseView === 'raw' }"
              @click="responseView = 'raw'"
            >
              raw
            </button>
          </div>
          <pre>{{ responseContent() }}</pre>
        </div>
      </dialog>
    </template>
    <pre v-if="result.error" class="error">{{ result.error }}</pre>
  </div>
</template>

<style scoped>
.card {
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 12px;

  &.error {
    border-color: var(--color-error-bg);
  }
}

.card-head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.card-text {
  display: flex;
  align-items: baseline;
  gap: 16px;
  min-width: 0;

  .name {
    overflow: hidden;
    font-weight: 600;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;

  &.success {
    background: var(--color-success-bg);
    color: var(--color-success);
  }

  &.error {
    background: var(--color-error-bg);
    color: var(--color-error);
  }

  &.running {
    background: var(--color-primary-disabled);
    color: var(--color-text-secondary);
  }
}

.mode {
  margin-left: auto;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--color-bg);
  color: var(--color-text-secondary);
  font-size: 11px;
}

.timings {
  display: flex;
  align-items: baseline;
  gap: 12px;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.metric {
  color: inherit;
}

.latency {
  color: inherit;
}

@media (max-width: 560px) {
  .mode {
    margin-left: 0;
  }
}

.tokens {
  display: flex;
  gap: 14px;
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 10px;

  b {
    color: var(--color-text);
  }
}

pre {
  margin: 0;
  padding: 10px;
  border-radius: 6px;
  background: var(--color-bg);
  font-size: 12px;
  font-family: var(--mono);
  line-height: 1.5;
  text-wrap-mode: nowrap;
  overflow-x: auto;

  &.error {
    color: var(--color-error);
  }
}

.raw-button {
  display: block;
  margin-top: 10px;
  padding: 0;
  border: none;
  background: none;
  color: var(--color-text-muted);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  transition: 0.2s;

  &:hover {
    color: var(--color-text);
  }
}

.raw-dialog {
  position: fixed;
  inset: 0;
  width: min(900px, calc(100vw - 32px));
  max-width: none;
  height: min(80dvh, 720px);
  max-height: none;
  box-sizing: border-box;
  margin: auto;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-panel);
  color: var(--color-text);
  opacity: 0;
  transform: scale(0.98);
  box-shadow: 0 24px 80px rgb(0 0 0 / 36%);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease,
    display 0.2s allow-discrete,
    overlay 0.2s allow-discrete;

  &[open] {
    display: flex;
    flex-direction: column;
    opacity: 1;
    transform: scale(1);
  }

  &::backdrop {
    background: rgb(0 0 0 / 0%);
    transition:
      background-color 0.2s ease,
      display 0.2s allow-discrete,
      overlay 0.2s allow-discrete;
  }

  &[open]::backdrop {
    background: rgb(0 0 0 / 64%);
  }
}

.response-content {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  gap: 12px;
  padding: 16px;

  &.view-output_text .response-switch::before {
    transform: translateX(calc(100% + 2px));
  }

  &.view-raw .response-switch::before {
    transform: translateX(calc(200% + 4px));
  }

  pre {
    flex: 1;
    min-height: 0;
    overflow: auto;
    padding: 16px;
    border-radius: 6px;
  }

  &.view-output_text > pre {
    text-wrap-mode: wrap;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    overflow-x: hidden;
  }
}

.response-switch {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  flex-shrink: 0;
  padding: 3px;
  border: 1px solid var(--color-border);
  border-radius: 7px;
  background: var(--color-bg);

  &::before {
    position: absolute;
    z-index: 0;
    top: 3px;
    bottom: 3px;
    left: 3px;
    width: calc(33.333% - 4px);
    border-radius: 5px;
    background: var(--color-primary-subtle);
    content: '';
    pointer-events: none;
    transition: 0.2s;
  }

  button {
    position: relative;
    z-index: 1;
    min-width: 0;
    padding: 5px 8px;
    border: none;
    border-radius: 5px;
    background: transparent;
    color: var(--color-text-secondary);
    cursor: pointer;
    font: inherit;
    font-size: 12px;
    transition: 0.2s;

    &.active {
      color: var(--color-text);
    }
  }
}

@starting-style {
  .raw-dialog[open] {
    opacity: 0;
    transform: scale(0.98);
  }

  .raw-dialog[open]::backdrop {
    background: rgb(0 0 0 / 0%);
  }
}

.raw-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-shrink: 0;
  padding: 14px 16px;
  border-bottom: 1px solid var(--color-border);

  h2 {
    margin: 0;
    font-size: 15px;
  }

  form {
    margin: 0;
  }
}

.raw-close {
  padding: 0;
  border: none;
  background: none;
  color: var(--color-text-muted);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  transition: 0.2s;

  &:hover {
    color: var(--color-text);
  }
}

@media (max-width: 640px) {
  .raw-dialog {
    width: calc(100vw - 20px);
    height: calc(100dvh - 20px);
  }
}
</style>
