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
        const { likeTableLogicalName, likeTableIdAttribute, lookUpValueAttribute, parentTableCollectionName, lookUpAttributeName } = context.parameters
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
        return {};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }

    private getPageParameters(): any {
        //get current page url
        const url = window.location.href;

        //get the part after question mark with parameters list
        const parametersString = url.split("?")[1];

        let parametersObj: any = {};

        if (parametersString) {
            // split string to pair parameter=value
            for (let paramPairStr of parametersString.split("&")) {
                let paramPair = paramPairStr.split("=");
                parametersObj[paramPair[0]] = paramPair[1];
            }
        }
        return parametersObj;
    }
}
