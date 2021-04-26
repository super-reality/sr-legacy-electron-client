

import reduxAction from "../../../redux/reduxAction";

import Header from './Header/Header'

import HeaderBoard from './HeaderBoard/HeaderBoard'
import HeaderSearch from './HeaderSearch/HeaderSearch'
import HeaderUser from './HeaderUser/HeaderUser'
import BoardMenu from "./BoardMenu/BoardMenu"
import Boards from "./Boards/Boards"
import BoardItem from "./Boards/BoardItem"
import BoardSearch from "./BoardMenu/BoardSearch"
import Subheader from "./Subheader/Subheader"
import BoardContainer from "./BoardContainer/BoardContainer"
import BoardColumn from "./BoardColumn/BoardColumn"
import BoardColCard from "./BoardColCard/BoardColCard"
import CreateModal from "./Modals/CreateModal"
import NotiModal from "./Modals/NotiModal"
import InfoModal from "./Modals/InfoModal"
import AccModal from "./Modals/AccModal"
import InviteModal from "./Modals/InviteModal"
import SubAccModal from "./Modals/SubAccModal"
import BoardColModal from "./Modals/BoardColModal"
import CardDetailModal from "./Modals/CardDetailModal"
import SubMoreMenu from "./Modals/SubMoreMenu"

export function CloseModals (dispatch:any, exceptModalString: string) {
    
  const typeList = [
    "SET_SHOW_BOARDMENU",
    "SET_SHOW_CREATE_MODAL",
    "SET_SHOW_NOTI_MODAL",
    "SET_SHOW_INFO_MODAL",
    "SET_SHOW_ACC_MODAL",
    "SET_SHOW_INVITE_MODAL",
    "SET_SHOW_SUB_ACC_MODAL",
    "SET_SHOW_BOARD_COL_MODAL",
    "SET_SHOW_SUB_MORE_MENU",
  ]
  
  typeList.forEach(one=>{
    if(exceptModalString != one){
      
      reduxAction(dispatch, {
        type: one as any,
        arg: false,
      });
    }
  })


  
};

export function CloseEdits(dispatch: any, exceptEditString: string|null|undefined){

  const typeList = [
    "SET_EDIT_COL",
    "SET_ADD_CARD_COL"
  ]

  
  typeList.forEach(one=>{
    if(exceptEditString != one){
      reduxAction(dispatch, {
        type:one as any, 
        arg: null
      })
    }
  })


}

export{
    Header,
    HeaderBoard,
    HeaderSearch,
    HeaderUser,
    BoardMenu,
    Boards,
    BoardItem,
    BoardSearch,
    Subheader,
    BoardContainer,
    BoardColumn,
    BoardColCard,
    CreateModal,
    NotiModal,
    InfoModal,
    AccModal,
    InviteModal,
    SubAccModal,
    BoardColModal,
    CardDetailModal,
    SubMoreMenu    
}