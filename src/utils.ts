import { AppState, Task, TaskState } from "./models";

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const generateText = (length: number): string => {
	
	let result = "";
	
	for (let i = 0; i < length; i++) {
        const randomChar = Math.floor(Math.random() * characters.length);
	    result += characters.charAt(randomChar);
	}
	
	return result;
}

export const defaultAppState: AppState = {
    items: [],
    stats: {
        count: 0,
        completed: 0,
        created: 0,
        inProgress: 0,
    }
}

export const createTask = (ids: Set<string>): Task => {
    let id = Math.random().toString(36).slice(2, 9);

    while(ids.has(id)) {
        console.log(id);
        id = Math.random().toString(36).slice(2, 9);
    }

    ids.add(id);

    const createdOn = new Date();

    const item: Task = {
        id,
        name: `Task - ${id}`,
        state: TaskState.Created,
        createdOn,
        updatedOn: createdOn,
        description: generateText(30),
    };

    return item;
}