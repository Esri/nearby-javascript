import { TopAppBarActionItem } from "@rmwc/top-app-bar";
import React from "react";

import SimpleLink from "./styled/SimpleLink";

export const NavToMap = () => (
  <SimpleLink to="/map">
    <TopAppBarActionItem aria-label="Open Map" alt="Open Map" icon="map" />
  </SimpleLink>
);

export const NavToList = ({ icon }: { icon: string }) => (
  <SimpleLink to="/list">
    <TopAppBarActionItem aria-label="Open List" alt="Open List" icon={icon} />
  </SimpleLink>
);
