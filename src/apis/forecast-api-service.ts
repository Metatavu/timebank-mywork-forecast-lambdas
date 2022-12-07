import { Configuration, ProjectsApi, SprintsApi, TasksApi } from "src/generated/forecast-client";
import { AllocationsApi } from "src/generated/forecast-client/apis/AllocationsApi";
import { TimeRegistrationsApi } from "src/generated/forecast-client/apis/TimeRegistrationsApi";
import Config from "../app/config";


/**
 * Creates ForecastApiService
 */
export class ForecastApiService {
 /**
   * Gets api configuration
   *
   * @param token accessToken
   * @returns new configuration
   */
  private static getConfiguration() {
    const { apiKey, baseUrl } = Config.get().forecast;

    return new Configuration({
      basePath: baseUrl,
      apiKey: apiKey
    });
  }

  /**
   * Gets initialized DailyEntries API
   * 
   * @returns initialized DailyEntries API
   */
  public static getProjectsApi() {
    return new ProjectsApi(ForecastApiService.getConfiguration());
  }

  /**
   * Get sprints of selected project
   * @returns 
   */
  public static getSprintsApi() {
    return new SprintsApi(ForecastApiService.getConfiguration());
  }

  /**
   * Get tasks of selected project
   * 
   * @returns
   */
  public static getTasksApi() {
    return new TasksApi(ForecastApiService.getConfiguration())
  }

  /**
   * Get allocations
   * 
   * @returns 
   */
  public static getAllocationsApi() {
    return new AllocationsApi(ForecastApiService.getConfiguration())
  }

  /**
   * Get time registerations
   * 
   * @returns
   */
  public static getTimeRegistrationsApi() {
    return new TimeRegistrationsApi(ForecastApiService.getConfiguration())
  }
}