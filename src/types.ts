// =========================================
// TYPES.TS - Wszystkie typy i interfejsy
// =========================================

// Enum (enumerated type) dla priorytetu
export enum Priority {
    Low = "low",
    Medium = "medium",
    High = "high"
}

// Enum dla filtrów
export enum FilterType {
    All = "all",
    Active = "active",
    Completed = "completed",
    High = "high"
}

// Interfejs główny - zadanie
export interface Task {
    id: string;
    text: string;
    completed: boolean;
    priority: Priority;
    createdAt: string;
}

// Interfejs stanu aplikacji
export interface AppState {
    tasks: Task[];
    currentFilter: FilterType;
}

// Interfejs statystyk
export interface TaskStats {
    total: number;
    active: number;
    completed: number;
}

// Typ dla opcji priorytetu (do selecta)
export interface PriorityOption {
    value: Priority;
    label: string;
    emoji: string;
}

// Stałe dla priorytetów
export const PRIORITY_OPTIONS: PriorityOption[] = [
    { value: Priority.Low, label: "Niski", emoji: "🟢" },
    { value: Priority.Medium, label: "Średni", emoji: "🟡" },
    { value: Priority.High, label: "Wysoki", emoji: "🔴" }
];