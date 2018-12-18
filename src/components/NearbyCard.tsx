import React from "react";
import {
  ListItemGraphic,
  ListItemMeta,
  ListItemSecondaryText,
  ListItemText
} from "rmwc/List";

import ListItemContainer from "./styled/ListItemContainer";

export interface AddressItem {
  name: string;
  address: string;
  type: string;
  distance: number;
  bearing: string;
  icon: string;
}

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
