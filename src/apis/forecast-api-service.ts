import { Allocation } from "./schemas/allocation";
import { Project } from "./schemas/project";
import { Task } from "./schemas/task";

export interface ForecastApiService {
    getAllocations: () => Promise<Allocation[]>;
    getProjects: () => Promise<Project[]>;
    getTasks: (projectId: number) => Promise<Task[]>;
    getAllTasks: () => Promise<Task[]>;
    getProjectSprints: (projectId: number) => Promise<Sprint[]>;
}

/**
 * Creates ForecastApiService
 */
export function CreateForecastApiService(): ForecastApiService {
    const apiKey: string = process.env.FORECAST_API_KEY;

    return {
        /**
         * Gets all allocations from the api
         * 
         * @returns List of allocations
         */
        async getAllocations(): Promise<Allocation[]> {
            const response = await fetch("https://api.forecast.it/api/v1/allocations", { headers: { "X-FORECAST-API-KEY": apiKey } });

            return response.json();
        },

        /**
         * Gets all projects from the api
         * 
         * @returns List of projects
         */
        async getProjects(): Promise<Project[]> {
            const response = await fetch("https://api.forecast.it/api/v1/projects", { headers: { "X-FORECAST-API-KEY": apiKey } });

            return response.json();
        },

        /**
         * Gets all tasks from the api filtered by project id
         * 
         * @param projectId Id of project
         * @returns List of tasks 
         */
        async getTasks(projectId: number): Promise<Task[]> {
            const response = await fetch(`https://api.forecast.it/api/v3/projects/${projectId}/tasks`, { headers: { "X-FORECAST-API-KEY": apiKey } });

            return response.json();
        },

        async getAllTasks(): Promise<Task[]> {
            const response = await fetch("https://api.forecast.it/api/v3/tasks", { headers: { "X-FORECAST-API-KEY": apiKey } });

            return response.json();
        },

        async getProjectSprints(projectId: number): Promise<Sprint[]> {
            const response = await fetch(`https://api.forecast.it/api/v3/projects/${projectId}/sprints`, { headers: { "X-FORECAST-API-KEY": apiKey } });

            return response.json();
        }
    }
}