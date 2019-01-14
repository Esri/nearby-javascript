import styled from "@emotion/styled";
import { List } from "@rmwc/list";

const ListContainer = styled<any>(List)`
  margin-top: 64px;
  @media (min-width: 900px) {
    min-width: 425px;
    overflow-y: auto;
  }
`;

export default ListContainer;
