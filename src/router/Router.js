import { ContextProvider } from "../context/Context";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Landing from "../pages/Landing";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import ProfilePage from "../pages/profile/Profile";
import AccountPage from "../pages/AccountSettings";
import Detail from "../pages/detail/Detail";
import UserDetail from "../pages/userDetail/userDetail";
import PasswordReset from "../pages/PasswordReset";
import PasswordResetConfirm from "../pages/PasswordResetConfirm";
import CreatePost from "../pages/CreatePost";
import PostEdit from "../pages/PostEdit";
import PrivateRouter from './PrivateRouter';

export default function Router() {
  return (
    <ContextProvider>
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Landing} exact />
          <Route path="/home" component={Home} exact />
          <Route path="/about" component={About} exact />
          <Route path="/contact" component={Contact} exact />
          <Route path="/password-reset" component={PasswordReset} exact />
          <Route path="/password-reset/:uidb64/:token" component={PasswordResetConfirm} exact />
          <PrivateRouter path="/profile" component={ProfilePage} exact />
          <PrivateRouter path="/account" component={AccountPage} exact />
          <PrivateRouter path="/user-detail/:username" component={UserDetail} exact />
          <PrivateRouter path="/detail/:slug" component={Detail} exact />
          <PrivateRouter path="/create" component={CreatePost} exact />
          <PrivateRouter path="/edit/:slug" component={PostEdit} exact />
        </Switch>
      </BrowserRouter>
    </ContextProvider>
  );
}
