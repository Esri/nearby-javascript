import styled from "@emotion/styled";
import { List, ListDivider } from "@rmwc/list";
import React, { useContext, useEffect } from "react";

import { AppContext } from "../contexts/App";
import { NearbyCard } from "./NearbyCard";

import { NearbyItem } from "../interfaces/common";

const ListContainer = styled<any>(List)`
  margin-top: 64px;
  @media (min-width: 900px) {
    min-width: 425px;
    overflow-y: auto;
  }
`;

const renderCards = (items: NearbyItem[]) =>
  items.map(
    (addressItem, idx) =>
      [
        <NearbyCard key={`${idx}-card`} {...addressItem} />,
        <ListDivider key={`${idx}-divider`} />
      ]
  );

let mounted = false;

const NearbyPlaces = () => {
  const { state, setState } = useContext(AppContext);
  
  useEffect(() => {
    mounted = true;
    setState({
      mounted
    });
    return () => {
      mounted = false;
    };
  }, []);
  

  return <ListContainer>{renderCards(state.items)}</ListContainer>;
};

export default NearbyPlaces;
