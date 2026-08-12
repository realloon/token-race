<script setup lang="ts">
import type { TestRequest } from '@/types'
import { computed } from 'vue'
import IconClose from './icons/IconClose.vue'

const { request } = defineProps<{ request: TestRequest }>()

const activeInputs = computed(() =>
  request.stream ? request.streamInputs : request.completeInputs,
)
</script>

<template>
  <dialog id="request-editor">
    <form method="dialog">
      <header class="drawer-header">
        <h2 id="request-editor-title">Edit request</h2>
        <button><IconClose /></button>
      </header>

      <section class="body">
        <div>
          <label>
            Model
            <input v-model="request.model" spellcheck="false" />
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
            <input v-model="m.content" />
          </template>
        </div>
      </section>

      <footer>
        <button>Done</button>
      </footer>
    </form>
  </dialog>
</template>

<style scoped>
dialog {
  position: fixed;
  inset: 0 0 0 auto;
  max-height: none;
  padding: unset;
  border: unset;
  box-shadow: -16px 0 40px rgb(0 0 0 / 0.2);
  transition: 0.2s;

  &[open] {
    @starting-style {
      opacity: 0;
      transform: translateX(24px);
    }
  }

  &::backdrop {
    background-color: color-mix(in srgb, var(--color-page) 70%, transparent);
  }
}

form {
  display: flex;
  flex-direction: column;

  background-color: var(--color-page);

  width: min(400px, 100dvw);
  height: 100dvh;
  border-left: 1px solid var(--color-border);
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 16px;
  border-bottom: 1px solid var(--color-border);

  button {
    padding: 4px;
    border: unset;
    border-radius: 50%;
    background-color: transparent;
    transition: 0.2s;

    &:hover {
      background-color: var(--color-border);
    }

    svg {
      width: 16px;
      height: 16px;
      vertical-align: top;
    }
  }
}

.body {
  flex-grow: 1;
  padding: 16px;

  div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;

    @media (max-width: 560px) {
      grid-template-columns: 1fr;
      gap: 0;
    }
  }
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
  color: var(--color-text);
  background-color: var(--color-page);
  font-family: var(--mono);
  font-size: 0.75rem;
  line-height: 1.5;
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
  background-color: var(--color-page);
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
  font-size: 0.75rem;
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
    background-color: var(--color-page);
    font-family: var(--mono);
    font-size: 0.75rem;
    color: var(--color-text);
  }
}

footer {
  display: flex;
  justify-content: end;
  padding: 16px;
  border-top: 1px solid var(--color-border);

  button {
    color: var(--color-primary-foreground);
    background-color: var(--color-primary);
    padding: 6px 16px;
    border: unset;
    border-radius: 6px;

    transition: 0.2s;

    &:hover {
      opacity: 0.7;
    }
  }
}
</style>
