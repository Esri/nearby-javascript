import styled from "@emotion/styled";
import React, { useContext } from "react";
import { List } from "rmwc/List";

import { AppContext } from "../contexts/App";
import { NearbyCard } from "./NearbyCard";

import { NearbyItem } from "../interfaces/common";

const ListContainer = styled<any>(List)`
  margin-top: 64px;
`;

const renderCards = (items: NearbyItem[]) =>
  items.map((addressItem, idx) => <NearbyCard key={idx} {...addressItem} />);

const NearbyPlaces = () => {
  const { state } = useContext(AppContext);

  return <ListContainer>{renderCards(state.items)}</ListContainer>;
};

export default NearbyPlaces;
