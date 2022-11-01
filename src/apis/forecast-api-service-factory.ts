import { ForecastApiService } from "./forecast-api-service";

export class ForecastApiServiceFactory {
    
    /**
     * Initializes ForecastApiService and returns it
     * 
     * @returns Instance of ForecastApiService
     */
    public static getService(): ForecastApiService {
        return new ForecastApiService(process.env.FORECAST_API_KEY);
    }
}