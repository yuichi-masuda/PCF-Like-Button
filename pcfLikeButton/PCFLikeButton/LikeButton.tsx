import * as React from 'react';
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { IIconProps } from '@fluentui/react';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { useState, useEffect } from 'react';

export interface ILikeButtonProps {
  context: ComponentFramework.Context<IInputs>;
  query: string;
  recordId: string;
  logicalName: string;
  parentTableCollectionName: string;
  lookUpAttributeName: string;
  likeTableIdAttribute: string;
}

const LikeIcon: IIconProps = { iconName: 'Like' };
const LikeIconSolid: IIconProps = { iconName: 'LikeSolid' };

export const LikeButton: React.FC<ILikeButtonProps> = (props) => {
  const [checked, setChecked] = React.useState(false);
  const [likeId, setLikeId] = React.useState("");

  const attributeName: string = `${props.lookUpAttributeName}@odata.bind`
  const createLikeRecrod: any = () => {
    const data: any = {
      [attributeName]: `/${props.parentTableCollectionName}(${props.recordId})`
    };
    props.context.webAPI.createRecord(props.logicalName, data).then
      (
        function (response: ComponentFramework.LookupValue) {
          console.log(response.id);
          console.log("create success!");
          setChecked(true);
          setLikeId(response.id);
        },
        function (errorResponse: any) {
          // エラーのハンドル
          console.log(errorResponse);
        }
      );
  }

  const deleteLikeRecrod: any = () => {
    props.context.webAPI.deleteRecord(props.logicalName, likeId).then
      (
        function (response: ComponentFramework.LookupValue) {
          console.log(response.id);
          console.log("delete success!");
          setChecked(false);
          setLikeId("");
        },
        function (errorResponse: any) {
          // エラーのハンドル
          console.log(errorResponse);
        }
      );
  }

  const getRecords: any = (context: ComponentFramework.Context<IInputs>, logicalName: string, query: string) => {
    return context.webAPI.retrieveMultipleRecords(logicalName, query).then(
      function (response: ComponentFramework.WebApi.RetrieveMultipleResponse) {
        const result = response.entities;

        if (result.length == 0) {
          setChecked(false);
        } else {
          setChecked(true);
          setLikeId(result[0][props.likeTableIdAttribute]);
        }
      },
      function (errorResponse: any) {
        // エラーのハンドル
        console.log(errorResponse);
      }
    )
  }


  console.log(checked);
  useEffect(() => getRecords(props.context, props.logicalName, props.query)
    , []);

  return (
    <DefaultButton
      className='pcfLikeButton'
      toggle
      text={checked ? 'いいね済み' : 'いいね'}
      iconProps={checked ? LikeIconSolid : LikeIcon}
      allowDisabledFocus
      onClick={checked ? () => deleteLikeRecrod() : () => createLikeRecrod()}
    />
  )
}
