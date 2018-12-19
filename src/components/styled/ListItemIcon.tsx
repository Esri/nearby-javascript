import { ListItemGraphic } from "rmwc/List";

import styled from "@emotion/styled";

const ListItemIcon = styled<any, any>(ListItemGraphic)`
  color: ${props => props.selected ? "#2196f3" : "gray" }
`;

export default ListItemIcon;
