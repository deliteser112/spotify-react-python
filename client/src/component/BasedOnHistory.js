import { useState } from "react";
import styled from "styled-components/macro";
import { StyledSearch, StyledTrackList } from "../styles";

const BasedOnHistory = () => {
  return (
    <div>
      <h1 className="">Based on History</h1>
      <br />
      <br />
      <StyledSearch>Search</StyledSearch>
      <StyledTrackList></StyledTrackList>
    </div>
  );
};
export default BasedOnHistory;
