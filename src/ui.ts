// =========================================
// UI.TS - Renderowanie DOM
// =========================================

import { Task, TaskStats, FilterType, PRIORITY_OPTIONS } from './types.js';
import { filterTasks, formatDate } from './utils.js';

// ===== POMOCNICZA FUNKCJA DO POBIERANIA ELEMENTÓW =====

function getEl<T extends HTMLElement>(id: string): T {
    const el = document.getElementById(id);
    if (!el) throw new Error(`Element #${id} nie istnieje!`);
    return el as T;
}

// ===== STATYSTYKI =====

export function updateStats(stats: TaskStats): void {
    getEl<HTMLSpanElement>('totalCount').textContent = stats.total.toString();
    getEl<HTMLSpanElement>('activeCount').textContent = stats.active.toString();
    getEl<HTMLSpanElement>('completedCount').textContent = stats.completed.toString();
}

// ===== FILTRY =====

export function updateFilterButtons(activeFilter: FilterType): void {
    document.querySelectorAll<HTMLButtonElement>('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === activeFilter);
    });
}

// ===== LISTA ZADAŃ =====

export function renderTasks(
    tasks: Task[],
    filter: FilterType,
    onToggle: (id: string) => void,
    onDelete: (id: string) => void
): void {
    const list = getEl<HTMLDivElement>('tasksList');
    const filtered = filterTasks(tasks, filter);

    if (!filtered.length) {
        list.innerHTML = renderEmptyState(filter);
        return;
    }

    list.innerHTML = filtered.map(task => renderTaskItem(task)).join('');

    // Delegacja eventów - jeden listener dla całej listy
    list.querySelectorAll<HTMLInputElement>('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            onToggle(checkbox.dataset.id ?? '');
        });
    });

    list.querySelectorAll<HTMLButtonElement>('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            onDelete(btn.dataset.id ?? '');
        });
    });
}

// ===== SINGLE TASK =====

function renderTaskItem(task: Task): string {
    const priorityOption = PRIORITY_OPTIONS.find(p => p.value === task.priority);
    const emoji = priorityOption?.emoji ?? '🟡';
    const label = priorityOption?.label ?? 'Średni';

    return `
        <div class="task-item ${task.completed ? 'completed' : ''} priority-${task.priority}">
            <input
                type="checkbox"
                class="task-checkbox"
                data-id="${task.id}"
                ${task.completed ? 'checked' : ''}
            >
            <div class="task-content">
                <div class="task-text">${escapeHtml(task.text)}</div>
                <div class="task-meta">
                    <span class="priority-badge ${task.priority}">
                        ${emoji} ${label}
                    </span>
                    <span>🕒 ${formatDate(task.createdAt)}</span>
                </div>
            </div>
            <button class="delete-btn" data-id="${task.id}" title="Usuń zadanie">
                ×
            </button>
        </div>
    `;
}

// ===== PUSTY STAN =====

function renderEmptyState(filter: FilterType): string {
    const messages: Record<FilterType, { icon: string; title: string; sub: string }> = {
        [FilterType.All]: {
            icon: '📝',
            title: 'Brak zadań',
            sub: 'Dodaj swoje pierwsze zadanie!'
        },
        [FilterType.Active]: {
            icon: '🎉',
            title: 'Wszystko ukończone!',
            sub: 'Nie masz żadnych aktywnych zadań'
        },
        [FilterType.Completed]: {
            icon: '📋',
            title: 'Brak ukończonych',
            sub: 'Ukończ swoje pierwsze zadanie!'
        },
        [FilterType.High]: {
            icon: '✅',
            title: 'Brak pilnych zadań',
            sub: 'Nie masz zadań z wysokim priorytetem'
        }
    };

    const { icon, title, sub } = messages[filter];

    return `
        <div class="empty-state">
            <div class="empty-icon">${icon}</div>
            <h3>${title}</h3>
            <p>${sub}</p>
        </div>
    `;
}

// ===== BEZPIECZEŃSTWO - escape HTML =====
// Zapobiega XSS - co jeśli ktoś wpisze <script> w zadanie?

function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}