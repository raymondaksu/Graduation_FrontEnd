import { ContextProvider } from "../context/Context";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Landing from "../pages/Landing";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import ProfilePage from "../pages/profile/Profile";
import Detail from "../pages/detail/Detail";
import PrivateRouter from './PrivateRouter'

export default function Router() {
  return (
    <ContextProvider>
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Landing} exact />
          <Route path="/home" component={Home} exact />
          <Route path="/about" component={About} exact />
          <Route path="/contact" component={Contact} exact />
          <PrivateRouter path="/profile" component={ProfilePage} exact />
          <PrivateRouter path="/detail/:slug" component={Detail} exact />
          {/* 
            <Route path="/detail/:slug" component={PostDetail} exact />
             */}
          {/* <Route path="/create" component={PostPage} exact/>
              <Route path="/edit/:slug" component={CustomPostPage} exact/> */}
        </Switch>
      </BrowserRouter>
    </ContextProvider>
  );
}
