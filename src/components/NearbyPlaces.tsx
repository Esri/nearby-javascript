import { ListDivider } from "@rmwc/list";
import React, { useContext, useEffect } from "react";

import { AppContext } from "../contexts/App";
import { NearbyCard } from "./NearbyCard";
import ListContainer from "./styled/ListContainer";

import { NearbyItem } from "../interfaces/common";

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
  
  useEffect(
    () => {
      mounted = true;
      setState({
        mounted
      });
      return () => {
        mounted = false;
      };
    },
    []
  );
  

  return <ListContainer>{renderCards(state.items)}</ListContainer>;
};

export default NearbyPlaces;
