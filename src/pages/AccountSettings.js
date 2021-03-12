import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import moment from "moment";

import Navbar from "../components/navbar/Navbar";
import ChangePassword from "../components/ChangePassword";
import ChangeCredentials from "../components/ChangeCredentials";
import DeleteAccount from "../components/DeleteAccount";
import { wideButtonStyle } from "../styles/smallElements";
import { squareButtonsContainerStyle } from "../styles/smallElements";
import { squareButtonStyle } from "../styles/smallElements";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import Grid from "@material-ui/core/Grid";
import LockIcon from "@material-ui/icons/Lock";
import PersonIcon from "@material-ui/icons/Person";
import DeleteIcon from "@material-ui/icons/Delete";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

const useStyles = makeStyles({
  table: {
    width: "100%",
    backgroundColor: "#ffd384",
  },
});

//-----INLINE STYLES-----
const bodyStyle = {
  width: "60%",
  maxWidth: "600px",
  minWidth: "300px",
  display: "flex",
  flexDirection: "column",
  margin: "auto",
};
const header = {
  width: "100%",
  fontSize: "1.8rem",
  color: "#361E39",
  textAlign: "center",
  margin: "2rem auto",
  fontWeight: "bold",
};
const tableTitle = {
  fontSize: "13px",
  fontWeight: "bold",
  padding: "3px 10px",
};
const tableInfo = {
  fontSize: "13px",
  padding: "10px",
};

//-----------MAIN FUNC-----------------
function AccountPage() {
  const classes = useStyles();
  let history = useHistory();
  const [userData, setUserData] = useState([]);
  //----------Modal------------------------
  const [openPassword, setOpenPassword] = useState(false);
  const [openCredentials, setOpenCredentials] = useState(false);
  const [openDeleteAccount, setOpenDeleteAccount] = useState(false);
  //----------Fetch User Data------------
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const result = await axios.get(
        `https://fs-blog-backend.herokuapp.com/user/edit/`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token ? "Token " + token : null,
          },
        }
      );
      setUserData(result.data);
      // console.log(result.data);
    } catch ({ response }) {
      if (response) {
        console.log("No data");
      } else {
        console.log("Something went wrong!");
      }
    }
  };
  const refreshData = () => {
    fetchData();
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <div>
        <Navbar />
        <div style={header}>
          <p>Account Settings</p>
        </div>
        <div style={bodyStyle}>
          <TableContainer component={Paper} style={{ marginBottom: "1rem" }}>
            <Table className={classes.table} aria-label="simple table">
              <TableBody>
                <TableRow>
                  <p style={tableTitle}>Username</p>
                </TableRow>
                <TableRow>
                  <p style={{ ...tableInfo, textTransform: "capitalize" }}>
                    {userData?.username}
                  </p>
                </TableRow>
                <TableRow>
                  <p style={tableTitle}>Email</p>
                </TableRow>
                <TableRow>
                  <p style={tableInfo}>{userData?.email}</p>
                </TableRow>
                <TableRow>
                  <p style={tableTitle}>Member Since</p>
                </TableRow>
                <TableRow>
                  <p style={tableInfo}>
                    {moment(userData?.date_joined).format("MMMM Do YYYY, h:mm")}
                  </p>
                </TableRow>
                <TableRow>
                  <p style={tableTitle}>Last Login</p>
                </TableRow>
                <TableRow>
                  <p style={tableInfo}>
                    {moment(userData?.last_login).format("MMMM Do YYYY, h:mm")}
                  </p>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Grid container justify="center">
            <ChangePassword
              openPassword={openPassword}
              setOpenPassword={setOpenPassword}
            />
          </Grid>
          <Grid container justify="center">
            <ChangeCredentials
              open={openCredentials}
              setOpen={setOpenCredentials}
              user={userData}
              refresh={refreshData}
            />
          </Grid>
          <Grid container justify="center">
            <DeleteAccount
              open={openDeleteAccount}
              setOpen={setOpenDeleteAccount}
            />
          </Grid>
          {/* ---------Buttons----------- */}
          <div style={squareButtonsContainerStyle}>
            <button
              style={squareButtonStyle}
              title="Change Credentials"
              onClick={() => {
                setOpenCredentials(true);
              }}
            >
              <PersonIcon fontSize="small" />
              <br /> CHANGE CREDENTIALS
            </button>

            <button
              style={{
                ...squareButtonStyle,
                marginLeft: "10px",
                marginRight: "10px",
                backgroundColor: "#3c6382",
              }}
              title="Change Password"
              onClick={() => setOpenPassword(true)}
            >
              <LockIcon fontSize="small" />
              <br />
              CHANGE PASSWORD
            </button>

            <button
              style={{ ...squareButtonStyle, backgroundColor: "tomato" }}
              title="Delete Account"
              onClick={() => setOpenDeleteAccount(true)}
            >
              <DeleteIcon fontSize="small" />
              <br /> DELETE ACCOUNT
            </button>
          </div>
        </div>
        <Grid container xs={12} justify="center">
          <button
            style={{ ...wideButtonStyle, position: "relative" }}
            onClick={() => history.goBack()}
          >
            <ArrowBackIosIcon
              style={{
                position: "absolute",
                left: "20%",
                top: "50%",
                transform: "translateY(-50%)",
              }}
              fontSize="small"
            />
            &nbsp; Back
          </button>
        </Grid>
      </div>
    </>
  );
}
export default AccountPage;
