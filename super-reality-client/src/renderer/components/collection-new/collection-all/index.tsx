import React, { CSSProperties, useState } from "react";
import "./index.scss";
import "../../containers.scss";
import ContainerBasic from "../../base/base-container"
import ButtonSimple from "../../button-simple";
import { ContainerFlex, Image } from "../../item-inner";


interface ItemImage {
  src: string;
  style?: CSSProperties;
  className?: string;
}
interface CollectionNewProps {
  dataArray: string[]
}
export  const ItemImage = (props: ItemImage): JSX.Element => {
  const { src, className, style } = props;
  return (
    <img
      src={src}
      className={`collection-item-image ${className}`}
      style={{ ...style }}
    />
  )
}



export default function CollectionAll(props: CollectionNewProps): JSX.Element {
  const { dataArray } = props;


  return (
    <>
      {dataArray.map((item: string, indexF: number) => {
        return (
          <ContainerBasic key={item} className="collection-container">
            <ButtonSimple
              className="collecion-name-button"
              onClick={() => { console.log(item) }}
              >
              {`${item}`}
            </ButtonSimple>

            <ContainerBasic className="items-row" >
              {dataArray.map((itemM: string, index: number) => {
                return (
                  <ContainerBasic className="collection-item-container" key={itemM} >

                    <ContainerBasic className="collection-container-image-container">
                      <ItemImage src="https://www.cambridgeconsultants.com/sites/default/files/uploaded-images/Hero_Blog_VR-is-ready.jpg" />

                    </ContainerBasic>

                    <div className="collection-item-title">
                      {`Collection ${itemM} title ${index}`}
                    </div>

                  </ContainerBasic>
                )
              })}
            </ContainerBasic>

          </ContainerBasic>
        )
      })}

    </>
  )
}