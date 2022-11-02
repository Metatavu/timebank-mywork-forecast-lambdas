import { Allocation } from "./schemas/allocation";
import { Project } from "./schemas/project";
import { Task } from "./schemas/task";

/**
 * Class for the Forecast API
 */
export class ForecastApiService {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    /**
     * Gets all allocations from the api
     * 
     * @returns List of allocations
     */
    public async getAllocations(): Promise<Allocation[]> {
        let response = await fetch("https://api.forecast.it/api/v1/allocations", { headers: { "X-FORECAST-API-KEY": this.apiKey } });

        return response.json();
    }

    /**
     * Gets all projects from the api
     * 
     * @returns List of projects
     */
    public async getProjects(): Promise<Project[]> {
        let response = await fetch("https://api.forecast.it/api/v1/projects", { headers: { "X-FORECAST-API-KEY": this.apiKey } });

        return response.json();
    }

    /**
     * Gets all tasks from the api
     * 
     * @returns List of tasks
     */
    public async getTasks(): Promise<Task[]> {
        let response = await fetch("https://api.forecast.it/api/v3/tasks", { headers: { "X-FORECAST-API-KEY": this.apiKey } });

        return response.json();
    }
}