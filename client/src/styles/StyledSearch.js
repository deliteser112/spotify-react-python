import styled from "styled-components/macro";

const StyledSearch = styled.a`
  display: inline-block;
  background-color: var(--green);
  color: var(--white);
  border-radius: 30px;
  font-weight: 700;
  font-size: var(--fz-lg);
  padding: 10px 20px;
  cursor: pointer;
  &:hover,
  &:focus {
    text-decoration: none;
    filter: brightness(1.1);
  }
`;

export default StyledSearch;
