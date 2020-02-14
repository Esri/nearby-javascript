import styled from '@emotion/styled';
import { TopAppBar } from '@rmwc/top-app-bar';

// need to type as any, current limitation with @emotion/styled
const TopAppBarContainer: any = styled(TopAppBar)`
    height: 64px;
    background: rgba(0, 121, 193, 1);
`;

export default TopAppBarContainer;
