import { AppState, Task, TaskState } from "./models";
import { createTask } from "./utils";

type Action = {
    type: "create";
    item: Task;
} | {
    type: "progress";
    state: TaskState;
    id: string;
} | {
    type: "fail";
    state: TaskState;
    id: string;
} | {
    type: "remove";
    id: string;
} | {
    type: "reopen";
    id: string;
}

interface SimulationOptions {
    maxTaskCount: number;

}

const options: SimulationOptions = {
    maxTaskCount: 10,
}

const actionTypes = ["create", "progress", "fail", "remove", "reopen"] as const;

const progressState = (taskState: TaskState) => {
    switch(taskState) {
        case TaskState.Reopened:
            return TaskState.InProgress;
        case TaskState.Created:
            return TaskState.InProgress;
        case TaskState.InProgress:
            return TaskState.InQA;
        case TaskState.InQA:
            return TaskState.InTesting;
        case TaskState.FailedQA:
            return TaskState.InProgress;
        case TaskState.InTesting:
            return TaskState.Completed;
        case TaskState.FailedTesting:
            return TaskState.InProgress;
        case TaskState.Completed:
            throw new Error("Invalid state");
        default:
            throw new Error("Invalid state");
    }
}

const degressState = (taskState: TaskState) => {
    switch(taskState) {
        case TaskState.InQA:
            return TaskState.FailedQA;
        case TaskState.InTesting:
            return TaskState.FailedTesting;
        default:
            throw new Error("Invalid state");
    }
}

const ids: Set<string> = new Set<string>();
const progressableTaskStates = [
    TaskState.Created,
    TaskState.Reopened,
    TaskState.InProgress,
    TaskState.InQA,
    TaskState.FailedQA,
    TaskState.InTesting,
    TaskState.FailedTesting
];
const failableTaskStates = [TaskState.InQA, TaskState.InTesting];

const randomIndex = (length: number) => Math.floor(Math.random() * length);

const computeAction = (state: AppState, options: SimulationOptions): Action => {

    if(state.items.length < 2) {
        const item = createTask(ids);

        return {
            type: "create",
            item
        }
    }

    let index: number;
    let actionType: typeof actionTypes[number];
    let item: Task;
    let filtered: Array<Task>;
    let newState: TaskState;
  
    do {
        index = randomIndex(actionTypes.length);
        actionType = actionTypes[index];

        switch(actionType) {
            case "create":
                if(state.items.length >= options.maxTaskCount) {
                    continue;
                }

                item = createTask(ids);
    
                return {
                    type: actionType,
                    item,
                }
    
            case "progress":
                filtered = state.items.filter(item => progressableTaskStates.includes(item.state));
    
                if(!filtered.length) {
                    continue;
                }
    
                index = randomIndex(filtered.length);
                item = filtered[index];
    
                newState = progressState(item.state);
    
                return {
                    type: actionType,
                    id: item.id,
                    state: newState,
                }
    
            case "fail":
                filtered = state.items.filter(item => failableTaskStates.includes(item.state));
    
                if(!filtered.length) {
                    continue;
                }
    
                index = randomIndex(filtered.length);
                item = filtered[index];
    
                newState = degressState(item.state);
    
                return {
                    type: actionType,
                    id: item.id,
                    state: newState,
                }
    
            case "remove":
                filtered = state.items.filter(item => item.state === TaskState.Completed);
    
                if(!filtered.length) {
                    continue;
                }
    
                index = randomIndex(filtered.length);
                item = filtered[index];
    
                return {
                    type: actionType,
                    id: item.id
                }
    
            case "reopen":
                filtered = state.items.filter(item => item.state === TaskState.Completed);
    
                if(!filtered.length) {
                    continue;
                }
    
                index = randomIndex(filtered.length);
                item = filtered[index];

                return {
                    type: actionType,
                    id: item.id,
                }
    
            default:
                throw new Error("Unknown action");
        }

    }while(true);
}

export const simulation = (state: AppState): AppState => {
    const now = new Date();

    const action = computeAction(state, options);
    let item: Task;

    switch(action.type) {
        case "create":
            state.items.push(action.item);
            state.stats.count++;
            break;
        case "progress":
            item = state.items.find(pr => pr.id === action.id)!;
            item.state = action.state;
            item.updatedOn = now;
            
            if(action.state === TaskState.Completed) {
                state.stats.completed++;
            }

            break;
        case "fail":
            item = state.items.find(pr => pr.id === action.id)!;
            item.updatedOn = now;
            break;
        case "remove":
            const index = state.items.findIndex(pr => pr.id === action.id)!;
            state.items.splice(index, 1);
            break;
        case "reopen":
            item = state.items.find(pr => pr.id === action.id)!;
            
            item.state = TaskState.Reopened;
            item.reopenedOn = now;
            break;
    }

    return {
        ...state,
    };
}