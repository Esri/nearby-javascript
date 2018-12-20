import React, { useContext } from "react";
import {
  ListItemGraphic,
  ListItemMeta,
  ListItemSecondaryText,
  ListItemText
} from "rmwc/List";

import { AppContext } from "../contexts/App";

import ListItemContainer from "./styled/ListItemContainer";

import { NearbyItem } from "../interfaces/common";

export const NearbyCard = (item: NearbyItem) => {
  const {
    address,
    name,
    icon,
    bearing,
    distance
  } = item;

  const { setState } = useContext(AppContext);

  const onClick = () => {
    setState({
      currentNearbyItem: item
    });
  } 

  return (
    <ListItemContainer onClick={onClick}>
      <ListItemGraphic icon={icon || "help"} />
      <ListItemText>
        {name}
        <ListItemSecondaryText>
          <small>{address}</small>
        </ListItemSecondaryText>
      </ListItemText>
      <ListItemMeta icon="">
        {bearing}
        <ListItemSecondaryText>
          <small>{distance.toFixed(2)}m</small>
        </ListItemSecondaryText>
      </ListItemMeta>
    </ListItemContainer>
  )
};
