import * as React from 'react';
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { Label } from '@fluentui/react';
import { IIconProps } from '@fluentui/react';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { useState, useEffect } from 'react';

export interface IHelloWorldProps {
  name?: string;
  title: string;
  disabled?: boolean;
  context: ComponentFramework.Context<IInputs>;
  query: string;
  recordId: string;
  logical_name: string;

}
export interface IButtonExampleProps {
  // These are set based on the toggles shown above the examples (not needed in real code)
}



const LikeIcon: IIconProps = { iconName: 'Like' };
const LikeIconSolid: IIconProps = { iconName: 'LikeSolid' };

export const HelloWorld: React.FC<IHelloWorldProps> = (props) => {
  const [checked, setChecked] = React.useState(false);
  const [likeId, setLikeId] = React.useState("");
//   const queryData: any = () => {
  

  const createLikeRecrod: any = () => {
    const data: any = {
        "cr255_sample_product@odata.bind": `/sample_products(${props.recordId})`
    }; 
    props.context.webAPI.createRecord(props.logical_name, data).then
    (
        function (response: ComponentFramework.LookupValue)
        {
            console.log(response.id);
            console.log("create success!");
            setChecked(true);
            setLikeId(response.id);
        },
        function (errorResponse: any) 
        {
            // エラーのハンドル
            console.log(errorResponse);
        }
    );
  }

  const deleteLikeRecrod: any = () => {

    props.context.webAPI.deleteRecord(props.logical_name, likeId).then
    (
        function (response: ComponentFramework.LookupValue)
        {
            console.log(response.id);
            console.log("delete success!");
            setChecked(false);
            setLikeId("");
        },
        function (errorResponse: any) 
        {
            // エラーのハンドル
            console.log(errorResponse);
        }
    );
  }
  const getRecords: any = async (context: ComponentFramework.Context<IInputs>, logical_name: string, query: string) => {
    return await context.webAPI.retrieveMultipleRecords(logical_name, query).then(
        function (response: ComponentFramework.WebApi.RetrieveMultipleResponse) 
        {
            const result = response.entities;
            console.log(result);
            console.log("data - load");
            if (result.length == 0) {
               setChecked(false);
              console.log("set false");
            } else {
                setChecked(true);
                setLikeId(result[0].cr255_likeid);
                console.log(result[0]);
                console.log(result[0].cr255_likeid);
                console.log("set true");
            }
            console.log("checked is " + checked);
        },
        function (errorResponse: any) 
        {
            // エラーのハンドル
            console.log(errorResponse);
        }
        )
}
  //useEffect(queryData(), [checked]);
  //const muted = true;
  console.log(checked);
  useEffect(() => getRecords(props.context, props.logical_name, props.query)
  , []);

  return (
      <DefaultButton
        toggle
        muted={checked}
        text={checked ? 'いいね解除' : 'いいね'}
        iconProps={checked ? LikeIconSolid : LikeIcon}
        allowDisabledFocus
        onClick={checked ? () => deleteLikeRecrod() : () => createLikeRecrod()}
        disabled={props.disabled}
      />
  )
}

// export class HelloWorld extends React.Component<IHelloWorldProps ,IButtonExampleProps>{
//   const { disabled, checked } = this.props;
//   const [muted, { toggle: setMuted }] = useBoolean(false);

//   public render(): React.ReactNode {
//     return (
//       <>
//         <Label>
//         {this.props.name}
//       </Label>
//       <p>
//       <DefaultButton
//         toggle
//         checked={muted || checked}
//         text={muted ? 'Volume muted' : 'Volume unmuted'}
//         iconProps={muted ? volume0Icon : volume3Icon}
//         onClick={setMuted}
//         allowDisabledFocus
//         disabled={disabled}
//       />
//       </p>
//       </>
//     )
//   }
// }
