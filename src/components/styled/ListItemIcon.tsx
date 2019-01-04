import styled from "@emotion/styled";
import { ListItemGraphic } from "@rmwc/list";

const ListItemIcon = styled<any, any>(ListItemGraphic)`
  color: ${props => props.selected ? "#2196f3" : "gray" }
`;

export default ListItemIcon;
