import { useHistory } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import "./HomePagination.css";

import Navbar from "../components/navbar/Navbar";
import PostCard from "../components/card/Card";
import { SearchBox } from "../components/searchbox/SearchBox";

import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
// import Box from "@material-ui/core/Box";

import { LoopCircleLoading } from "react-loadingg";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& > *": {
      margin: theme.spacing(5),
    },
    minHeight: "70vh",
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
}));

// -----------INLINE STYLES--------
const searchContainerStyle = {
  width: "100%",
  height: "80px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "30px",
};
const paginationContainerStyle = {
  width: "100%",
  height: "50px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "60px",
  backgroundColor: "#f6f5f5",
};
const buttonStyle = {
  padding: '10px',
  // backgroundColor: "#dbdbf3",
  outline: 'none',
}
// ---------MAIN FUNCTION----------
function Home() {
  const [postDisplayList, setPostDisplayList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filteredDataWithPagination, setFilteredDataWithPagination] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  // const [nextURL, setNextURL] = useState("");
  const classes = useStyles();
  const history = useHistory();

  // -------for pagination---------
  const [offset, setOffset] = useState(0);
  const [perPage] = useState(6);
  const [pageCount, setPageCount] = useState(0);

  //-----------filter data---------
  const filterPosts = (keyword, data) => {
    const filterPostList = data.filter((item) => {
      return item.title.toUpperCase().indexOf(keyword.toUpperCase()) > -1;
    });
    setFilteredData(filterPostList);
  };

  // --------fetch data------------
  const fetchData = async (
    postListURL = "https://fs-blog-backend.herokuapp.com/api/post-list/"
  ) => {
    try {
      const result = await axios.get(postListURL);
      // setPostList([...postList, ...result?.data?.results]);
      const data = result?.data;
      setPostDisplayList(data);
      // setPostList([...postList, ...result?.data]);
      // setNextURL(result?.data?.next);
    } catch ({ response }) {
      if (response) {
        console.log("No data");
      } else {
        console.log("Something went wrong!");
      }
    }
  };

  const filteredDataFunc = () => {
    if (searchKeyword !== "") {
      filterPosts(searchKeyword, postDisplayList);
    } else {
      setFilteredData(postDisplayList)
    }
  };

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setOffset(selectedPage*6);
  };

  function paginationFunc () {
    const slice = filteredData.slice(offset, offset + perPage);
    setPageCount(Math.ceil(filteredData.length / perPage));
    setFilteredDataWithPagination(slice);
  }
  
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filteredDataFunc();
  }, [searchKeyword, postDisplayList]);
  
  useEffect(() => {
    paginationFunc();
  }, [filteredData, offset, postDisplayList]);

  // const handleLoadMore = () => {
  //   fetchData(nextURL);
  // };

  // -----------------RETURN------------------
  return !postDisplayList?.length ? (
    <div>
      <Navbar />
      <div style={searchContainerStyle}>
        <SearchBox />
      </div>
      <LoopCircleLoading />
    </div>
  ) : (
    <div
      style={{
        backgroundColor: "#f6f5f5",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <Navbar />
      <div style={searchContainerStyle}>
        <SearchBox keyword={searchKeyword} setKeyword={setSearchKeyword} />
      </div>
      <Grid container className={classes.root} spacing={5} justify="center">
        <Grid item xs={12}>
          <Grid container justify="center" spacing={5}>
            {filteredData.length ? (
              filteredDataWithPagination.map((item, id) => {
                return <PostCard item={item} id={id} />;
              })
            ) : (
              <div>
                <p>"{searchKeyword}" is not available in bloglist titles.</p>
                <Box p={9}><button type="" onClick={() => setSearchKeyword('')} style={buttonStyle}>Back to HomePage</button></Box>
              </div>
            )}
          </Grid>
        </Grid>
      </Grid>
      <div style={paginationContainerStyle}>
        <ReactPaginate
          previousLabel={"<"}
          nextLabel={">"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}
        />
      </div>

      {/* <Box display="flex" justifyContent="center" m={1} p={1} bgcolor="#d9dab0">
            <Box p={1} style={{ backgroundColor: "#f6f5f5" }}>
              {nextURL ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleLoadMore()}
                >
                  View More
                </Button>
              ) : null}
            </Box>
          </Box> */}
    </div>
  );
}

export default Home;
