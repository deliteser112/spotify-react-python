import styled from "styled-components/macro";

const StyledPlayed = styled.a`
  display: inline-block;
  background-color: #4c8da5;
  color: var(--white);
  border-radius: 20px;
  font-weight: 700;
  padding: 10px;

  &:hover,
  &:focus {
    text-decoration: none;
    filter: brightness(1.1);
  }
`;

export default StyledPlayed;
