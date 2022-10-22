import styled from "styled-components/macro";
const theme = {
  follow: {
    default: "#eb9716",
  },
  unfollow: {
    default: "#FB8209",
  },
};
const StyledFollow = styled.a`
  display: inline-block;
  background-color: ${(props) => theme[props.theme].default};
  color: var(--white);
  border-radius: 20px;
  font-weight: 700;
  padding: 10px;
  cursor: pointer;
  &:hover,
  &:focus {
    text-decoration: none;
    filter: brightness(1.1);
  }
`;
export default StyledFollow;
