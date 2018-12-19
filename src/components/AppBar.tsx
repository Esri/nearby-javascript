import React, { useContext } from "react";

import {
  TopAppBarActionItem,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle
} from "rmwc/TopAppBar";

import { AppContext } from "../contexts/App";
import { NavToList, NavToMap } from "./Nav";
import TopAppBarContainer from "./styled/TopAppBarContainer";

const navs = (mode: string) => {
  const nav = mode === "map" ? <NavToList icon={"navigate_before"} /> : [];
  const mapOrList =
    mode === "list" ? (
      <NavToMap />
    ) : (
      <NavToList icon={"format_list_bulleted"} />
    );

  return [nav, mapOrList];
};

const AppBar = (pops?: any) => {
  const { state, setState } = useContext(AppContext);
  const { mode } = state;
  const [nav, mapOrList] = navs(mode);

  const toggleFilter = () => {
    setState({
      showFilter: !state.showFilter
    });
  };

  return (
    <TopAppBarContainer mode={mode}>
      <TopAppBarRow>
        <TopAppBarSection alignStart>
          {nav}
          <TopAppBarTitle>Nearby Places</TopAppBarTitle>
        </TopAppBarSection>
        <TopAppBarSection alignEnd>
          <TopAppBarActionItem
            aria-label="Filter"
            alt="Filter"
            icon="filter_list"
            onClick={toggleFilter}
          />
          {mapOrList}
        </TopAppBarSection>
      </TopAppBarRow>
    </TopAppBarContainer>
  );
};

export default AppBar;
