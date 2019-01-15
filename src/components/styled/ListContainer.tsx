import styled from "@emotion/styled";
import { List } from "@rmwc/list";

const ListContainer = styled<any>(List)`
  margin-top: 64px;
  @media (min-width: 800px) {
    min-width: 425px;
    overflow-y: auto;
  }
  @media (max-width: 800px) {
    width: 100%;
  }
`;

export default ListContainer;
