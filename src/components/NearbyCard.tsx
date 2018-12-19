import React from "react";
import {
  ListItemGraphic,
  ListItemMeta,
  ListItemSecondaryText,
  ListItemText
} from "rmwc/List";

import ListItemContainer from "./styled/ListItemContainer";

import { AddressItem } from "../interfaces/common";

export const NearbyCard = ({
  address,
  name,
  icon,
  bearing,
  distance
}: AddressItem) => (
  <ListItemContainer>
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
);
