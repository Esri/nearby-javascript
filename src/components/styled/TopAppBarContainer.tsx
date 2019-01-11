import styled from "@emotion/styled";
import { TopAppBar } from "@rmwc/top-app-bar";

import { AppState } from "../../interfaces/common";

const colorHeader = "rgba(0, 121, 193, 1)";
const colorHeaderTransparent = "rgba(0, 121, 193, 0.7)";

// need to type as any, current limitation with @emotion/styled
const TopAppBarContainer: any = styled(TopAppBar)`
  position: fixed;
  background: ${(props: AppState) =>
    (props.mode === "list" || props.mode === "normal") ? colorHeader : colorHeaderTransparent};
`;

export default TopAppBarContainer;
