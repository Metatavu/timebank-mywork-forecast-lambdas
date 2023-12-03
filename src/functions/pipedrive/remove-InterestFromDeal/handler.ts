import { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { CreatePipedriveApiService, PipedriveApiService } from 'src/apis/pipedrive-api-service';

export interface RemoveInterestFromDealParameters {
    rowtype: string,
    uid: string,
    pid: string,
    existingInterest: string
}

interface Response {
    response: any;
}


const removeInterestFromDeal = async (api: PipedriveApiService, param: RemoveInterestFromDealParameters): Promise<string> => {
    // Assuming the add operation was successful

    const newValue = param.uid + ";";
    let updatedInterested = "";

    if (param.existingInterest === null || param.existingInterest === "null") {
        updatedInterested = newValue;
      }
      else {
        let userIdsArray = param.existingInterest.split(";");
        
        // Remove any empty strings from the array
        userIdsArray = userIdsArray.filter(id => id !== "");
    
        // Find the index of the uid in the idArray
        const indexToRemove = userIdsArray.indexOf(param.uid);

        if (indexToRemove !== -1){
          userIdsArray.splice(indexToRemove, 1);
          updatedInterested = userIdsArray.join(';');
          updatedInterested += ';'; // Add the semicolon at the end
        }
      }
  
    await api.removeDealInterestById(param.pid, updatedInterested);

    return 'Interest removed successfully';
};

const removeInterestFrmoDealHandler: ValidatedEventAPIGatewayProxyEvent<any> = async event => {
    const api = CreatePipedriveApiService();
    const getDataFromBody: RemoveInterestFromDealParameters = JSON.parse(JSON.stringify(event.body)) as RemoveInterestFromDealParameters;
    const res = await removeInterestFromDeal(api, getDataFromBody);
    
    return {
        statusCode: 200,
        body: res     
    };
}

export const main = middyfy(removeInterestFrmoDealHandler);