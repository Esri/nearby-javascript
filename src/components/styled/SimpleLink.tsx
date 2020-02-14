import styled from '@emotion/styled';
import { Link } from '@reach/router';

const SimpleLink = styled(Link)`
    text-decoration: none;

    &:focus,
    &:hover,
    &:visited,
    &:link,
    &:active {
        text-decoration: none;
    }
`;

export default SimpleLink;
