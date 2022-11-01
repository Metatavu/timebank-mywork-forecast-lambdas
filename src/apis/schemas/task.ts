export interface Task {
    id: string,
    title: string,
    description: string,
    project_id: number,
    remaining: number,
    estimate: number,
    start_date: Date,
    end_date: Date,
    assignedPersons: number[],
}