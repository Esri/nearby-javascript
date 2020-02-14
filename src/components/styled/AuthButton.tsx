import styled from '@emotion/styled';
import { TopAppBarActionItem } from '@rmwc/top-app-bar';

const AuthButton = styled<React.ComponentType>(TopAppBarActionItem)`
    border: ${(props: any) => (props.signedin === 'true' ? 'solid 1.5px white' : 'none')};
    border-radius: ${(props: any) => (props.signedin === 'true' ? '50%' : '0')};
`;

export default AuthButton;
