import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { LikeButton, ILikeButtonProps } from "./LikeButton";
import * as React from "react";

export class PCFLikeButton implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;

    /**
     * Empty constructor.
     */
    constructor() { }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const { likeTableLogicalName, likeTableIdAttribute, lookUpValueAttribute, parentTableCollectionName, lookUpAttributeName} = context.parameters
        const recordId = this.getPageParameters().id;

        if (!recordId) {
            return React.createElement('div');
        }

        const userId = context.userSettings.userId;
        const query = `?$filter=_ownerid_value eq ${userId.replace(/{|}/g, "")} and ${lookUpValueAttribute.raw} eq ${recordId}`;
        
        const props: ILikeButtonProps = { 
                context: context,
                query: query,
                recordId: recordId,
                logicalName: String(likeTableLogicalName.raw),
                parentTableCollectionName: String(parentTableCollectionName.raw),
                lookUpAttributeName: String(lookUpAttributeName.raw),
                likeTableIdAttribute: String(likeTableIdAttribute.raw)
            };
        return React.createElement(
            LikeButton, props
        );
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return { };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }

    private getPageParameters():any{
        //get current page url
        const url = window.location.href;
    
        //get the part after question mark with parameters list
        const parametersString = url.split("?")[1]; 
    
        let parametersObj:any = {};
    
        if(parametersString){
            // split string to pair parameter=value
            for(let paramPairStr of parametersString.split("&")){
                let paramPair = paramPairStr.split("=");
                parametersObj[paramPair[0]] = paramPair[1];
            }
        }
    
        //as a result you will have something like this
        // {
        //     appid: f22d7a50-53fa-42c7-93d3-fd2526e23055,
        //     pagetype: entityrecord,
        //     etn: contact,
        //     id: 77ffee28-1e8f-453f-8d51-493442bbb327
        // }
    
        return parametersObj;
    }

    private async getRecords(context: ComponentFramework.Context<IInputs>, logicalName: string, query: string) {
        const result = await context.webAPI.retrieveMultipleRecords(logicalName, query).then(
            function (response: ComponentFramework.WebApi.RetrieveMultipleResponse) 
            {
                const result = response.entities;
                console.log(result);
                console.log(result[0]);
                console.log(result[0].cr255_likeid);
                console.log("data - load");
                return result
    
            },
            function (errorResponse: any) 
            {
                // エラーのハンドル
                console.log(errorResponse);
            }
            )
        return result;
    }

    private deleteLikeRecrod: any = (context: ComponentFramework.Context<IInputs>, logicalName: string, recordId: string) => {

        context.webAPI.deleteRecord(logicalName, recordId).then
        (
            function (response: ComponentFramework.LookupValue)
            {
                console.log(response.id);
                console.log("delete success!");
      
            },
            function (errorResponse: any) 
            {
                // エラーのハンドル
                console.log(errorResponse);
            }
        );
      }

    private createLikeRecrod: any = (context: ComponentFramework.Context<IInputs>, logicalName: string, parentRecordId: string) => {
          const data: any = {
              "cr255_sample_product@odata.bind": `/sample_products(${parentRecordId})`
          }; 
          context.webAPI.createRecord(logicalName, data).then
          (
              function (response: ComponentFramework.LookupValue)
              {
                  console.log(response.id);
                  console.log("create success!");
        
              },
              function (errorResponse: any) 
              {
                  // エラーのハンドル
                  console.log(errorResponse);
              }
          );
        }
}
