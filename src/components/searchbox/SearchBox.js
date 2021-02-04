import { useContext, useRef, useState } from "react";
import {
  StyledSearchBox,
  StyledSearchInput,
  StyledSearchButton,
} from "./SearchBoxStyle";
// import { MovieContext } from "../../Movie";

import SearchIcon from "@material-ui/icons/Search";

export const SearchBox = ({ keyword, setKeyword }) => {
  // const [inputValue, setInputValue] = useState("");
  const inputRef = useRef();

  //   const { setSearchKeyword } = useContext(MovieContext);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // alert(inputRef?.current?.value);
        setKeyword(inputRef?.current?.value);
        inputRef.current.value = '';
    }
  };

  return (
    <StyledSearchBox>
      <StyledSearchInput
        ref={inputRef}
        color="black"
        isColored
        // onChange={(evt) => setInputValue(evt.target.value)}
        onKeyDown={handleKeyDown}
      />
      <StyledSearchButton
        onClick={
          () => {
            setKeyword(inputRef?.current?.value);
            inputRef.current.value = '';
          }
          // alert("clicked")
        }
      >
        <SearchIcon />
      </StyledSearchButton>
    </StyledSearchBox>
  );
};