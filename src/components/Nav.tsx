import React from "react";

import { TopAppBarActionItem } from "rmwc/TopAppBar";

import SimpleLink from "./styled/SimpleLink";

export const NavToMap = () => (
  <SimpleLink to="/map">
    <TopAppBarActionItem aria-label="Open Map" alt="Open Map" icon="map" />
  </SimpleLink>
);

export const NavToList = ({ icon }: { icon: string }) => (
  <SimpleLink to="/">
    <TopAppBarActionItem aria-label="Open List" alt="Open List" icon={icon} />
  </SimpleLink>
);
