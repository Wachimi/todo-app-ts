// =========================================
// APP.TS - Główna logika aplikacji
// =========================================

import { Task, AppState, Priority, FilterType } from './types.js';
import { generateId, calcStats, parsePriority } from './utils.js';
import { TypedStorage } from './storage.js';
import {
    renderTasks,
    updateStats,
    updateFilterButtons
} from './ui.js';

// =========================================
// STORAGE
// =========================================

const storage = new TypedStorage<AppState>('todoApp_ts');

// =========================================
// STAN APLIKACJI
// =========================================

const defaultState: AppState = {
    tasks: [],
    currentFilter: FilterType.All
};

let state: AppState = storage.load() ?? defaultState;

// =========================================
// INICJALIZACJA
// =========================================

document.addEventListener('DOMContentLoaded', (): void => {
    initEventListeners();
    render();
    console.log('✅ Todo App TypeScript załadowana!');
    console.log(`📊 Załadowano ${state.tasks.length} zadań`);
});

// =========================================
// EVENT LISTENERS
// =========================================

function initEventListeners(): void {
    const taskInput = document.getElementById('taskInput') as HTMLInputElement;
    const addBtn = document.getElementById('addBtn') as HTMLButtonElement;
    const clearBtn = document.getElementById('clearCompletedBtn') as HTMLButtonElement;

    // Dodawanie zadania
    addBtn.addEventListener('click', handleAddTask);
    taskInput.addEventListener('keypress', (e: KeyboardEvent): void => {
        if (e.key === 'Enter') handleAddTask();
    });

    // Filtry - delegacja eventów
    document.querySelector('.filters')?.addEventListener('click', (e: Event): void => {
        const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.filter-btn');
        if (!btn?.dataset.filter) return;

        state.currentFilter = btn.dataset.filter as FilterType;
        saveAndRender();
    });

    // Usuwanie ukończonych
    clearBtn.addEventListener('click', handleClearCompleted);
}

// =========================================
// AKCJE
// =========================================

function handleAddTask(): void {
    const input = document.getElementById('taskInput') as HTMLInputElement;
    const prioritySelect = document.getElementById('prioritySelect') as HTMLSelectElement;

    const text = input.value.trim();

    if (!text) {
        input.focus();
        input.style.borderColor = '#ef4444';
        setTimeout(() => { input.style.borderColor = ''; }, 1500);
        return;
    }

    const newTask: Task = {
        id: generateId(),
        text,
        completed: false,
        priority: parsePriority(prioritySelect.value),
        createdAt: new Date().toISOString()
    };

    state.tasks.unshift(newTask); // Nowe zadania na górze
    input.value = '';
    input.focus();

    saveAndRender();
}

function handleToggleTask(id: string): void {
    state.tasks = state.tasks.map(
        (task: Task): Task =>
            task.id === id ? { ...task, completed: !task.completed } : task
    );

    saveAndRender();
}

function handleDeleteTask(id: string): void {
    state.tasks = state.tasks.filter((task: Task): boolean => task.id !== id);
    saveAndRender();
}

function handleClearCompleted(): void {
    const completedCount = state.tasks.filter(t => t.completed).length;

    if (!completedCount) return;

    if (confirm(`Usunąć ${completedCount} ukończonych zadań?`)) {
        state.tasks = state.tasks.filter(task => !task.completed);
        saveAndRender();
    }
}

// =========================================
// RENDEROWANIE
// =========================================

function render(): void {
    renderTasks(
        state.tasks,
        state.currentFilter,
        handleToggleTask,
        handleDeleteTask
    );

    updateStats(calcStats(state.tasks));
    updateFilterButtons(state.currentFilter);
}

// =========================================
// ZAPIS I RENDER
// =========================================

function saveAndRender(): void {
    storage.save(state);
    render();
}