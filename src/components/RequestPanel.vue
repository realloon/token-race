<script setup lang="ts">
import { computed } from 'vue'
import type { TestRequest } from '@/types'

const props = defineProps<{ request: TestRequest }>()

const activeInputs = computed(() =>
  props.request.stream
    ? props.request.streamInputs
    : props.request.completeInputs,
)
</script>

<template>
  <dialog
    id="request-editor"
    class="request-drawer"
    aria-labelledby="request-editor-title"
  >
    <header class="drawer-header">
      <h2 id="request-editor-title">Edit request</h2>
      <form method="dialog">
        <button
          type="submit"
          class="close-button"
          value="cancel"
          aria-label="Close"
        >
          Close
        </button>
      </form>
    </header>

    <div class="drawer-body">
      <div class="grid2">
        <label>
          Model
          <input v-model="request.model" />
        </label>
        <label>
          Reasoning
          <select v-model="request.reasoning">
            <option value="none">none</option>
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
            <option value="xhigh">xhigh</option>
            <option value="max">max</option>
          </select>
        </label>
      </div>

      <label class="stream-toggle">
        <input v-model="request.stream" type="checkbox" />
        Stream response
      </label>

      <label>
        Instructions
        <textarea v-model="request.instructions" rows="2"></textarea>
      </label>

      <h3 class="messages-heading">Input messages</h3>
      <div class="input-list">
        <template v-for="(m, i) in activeInputs" :key="i">
          <span class="role">{{ m.role }}</span>
          <input v-model="m.content" :aria-label="`Message ${i + 1} content`" />
        </template>
      </div>
    </div>

    <footer class="drawer-footer">
      <form method="dialog">
        <button type="submit" class="done-button" value="done">Done</button>
      </form>
    </footer>
  </dialog>
</template>

<style scoped>
button {
  font: inherit;
}

.close-button {
  flex-shrink: 0;
  border: 1px solid var(--color-border);
  border-radius: 7px;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  font-size: 12px;
  padding: 6px 20px;
  transition: 0.2s;

  &:hover {
    border-color: var(--color-text-secondary);
    background: var(--color-bg);
  }
}

.request-drawer {
  flex-direction: column;
  position: fixed;
  inset: 0 0 0 auto;
  margin: 0;
  width: min(460px, 100vw);
  max-width: none;
  height: 100dvh;
  max-height: none;
  box-sizing: border-box;
  padding: 0;
  background: var(--color-panel);
  border: none;
  border-left: 1px solid var(--color-border);
  color: var(--color-text);
  opacity: 0;
  transform: translateX(24px);
  box-shadow: -18px 0 40px rgb(0 0 0 / 24%);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease,
    display 0.2s allow-discrete,
    overlay 0.2s allow-discrete;

  &[open] {
    display: flex;
    opacity: 1;
    transform: translateX(0);
  }

  &::backdrop {
    background: rgb(0 0 0 / 0%);
    transition:
      background-color 0.2s ease,
      display 0.2s allow-discrete,
      overlay 0.2s allow-discrete;
  }

  &[open]::backdrop {
    background: rgb(0 0 0 / 58%);
  }
}

@starting-style {
  .request-drawer[open] {
    opacity: 0;
    transform: translateX(24px);
  }

  .request-drawer[open]::backdrop {
    background: rgb(0 0 0 / 0%);
  }
}

.drawer-header,
.drawer-footer {
  flex-shrink: 0;
  padding: 16px;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid var(--color-border);

  form {
    margin: 0;
  }

  h2 {
    margin: 0;
    font-size: 18px;
  }
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid var(--color-border);

  form {
    margin: 0;
  }
}

.done-button {
  border: none;
  border-radius: 7px;
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 20px;
  transition: 0.2s;

  &:hover {
    background: var(--color-text);
  }
}

.grid2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

label {
  display: block;
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 10px;
}

input,
select,
textarea {
  box-sizing: border-box;
  display: block;
  width: 100%;
  margin-top: 4px;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--mono);
  font-size: 13px;
  line-height: 1.4;
  resize: none;
  transition: 0.2s;

  &:focus-visible {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-focus);
  }
}

.stream-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 2px 0 16px;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 7px;
  background: var(--color-bg);
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    border-color: var(--color-text-secondary);
  }

  input {
    accent-color: var(--color-primary);
    width: fit-content;
    margin: unset;
  }
}

select {
  appearance: none;
  -webkit-appearance: none;
}

.messages-heading {
  margin: 18px 0 8px;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.input-list {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;

  .role {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    margin-top: 4px;
    padding: 8px 10px;
    border-radius: 6px;
    border: 1px solid var(--color-border);
    background: var(--color-bg);
    font-family: var(--mono);
    font-size: 13px;
    color: var(--color-text);
  }

  input {
    min-width: 0;
  }
}

@media (max-width: 560px) {
  .grid2 {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
