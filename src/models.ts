export enum TaskState {
	Created = 0,
	InProgress = 1,
    InQA = 2,
	FailedQA = 3,
	InTesting = 4,
    FailedTesting = 5,
	Completed = 6,
	Reopened = 7
}

export interface Task {
	id: string;
	name: string;
	state: TaskState,
    createdOn: Date,
	updatedOn: Date,
	reopenedOn?: Date,
	description: string;
}

export interface TaskStats {
	count: number,
	created: number;
	inProgress: number;
	completed: number;
}

export interface AppState {
	stats: TaskStats;
	items: Task[];
}