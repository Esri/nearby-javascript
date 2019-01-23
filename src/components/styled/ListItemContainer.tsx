import styled from "@emotion/styled";
import { ListItem } from "@rmwc/list";

const ListItemContainer = styled(ListItem)`
  cursor: pointer;
  span > small {
    vertical-align: top;
  },
  @media only screen 
  and (min-device-width : 375px) 
  and (max-device-width : 812px) 
  and (-webkit-device-pixel-ratio : 3)
  and (orientation : portrait) {
    --mdc-ripple-fg-size: 0;
    --mdc-ripple-left: 0;
    --mdc-ripple-top: 0;
    --mdc-ripple-fg-scale: 1;
    --mdc-ripple-fg-translate-end: 0;
    --mdc-ripple-fg-translate-start: 0;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    will-change: transform, opacity;
  }
`;

export default ListItemContainer;
