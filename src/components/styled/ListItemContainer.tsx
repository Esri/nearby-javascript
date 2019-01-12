import styled from "@emotion/styled";
import { ListItem } from "@rmwc/list";

const ListItemContainer = styled(ListItem)`
  cursor: pointer;
  span > small {
    vertical-align: top;
  }
`;

export default ListItemContainer;
