// =========================================
// UTILS.TS - Funkcje pomocnicze
// =========================================

import { Task, TaskStats, Priority, FilterType } from './types.js';

// Generowanie unikalnego ID
export function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// Formatowanie daty
export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Filtrowanie zadań
export function filterTasks(tasks: Task[], filter: FilterType): Task[] {
    switch (filter) {
        case FilterType.Active:
            return tasks.filter(task => !task.completed);
        case FilterType.Completed:
            return tasks.filter(task => task.completed);
        case FilterType.High:
            return tasks.filter(task => task.priority === Priority.High);
        case FilterType.All:
        default:
            return tasks;
    }
}

// Obliczanie statystyk
export function calcStats(tasks: Task[]): TaskStats {
    return {
        total: tasks.length,
        active: tasks.filter(t => !t.completed).length,
        completed: tasks.filter(t => t.completed).length
    };
}

// Parsowanie priorytetu ze stringa
export function parsePriority(value: string): Priority {
    if (Object.values(Priority).includes(value as Priority)) {
        return value as Priority;
    }
    return Priority.Medium;
}