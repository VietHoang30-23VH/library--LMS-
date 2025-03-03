import { BrowserRouter as Router, Switch, Redirect, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./Context/AuthContext.js";
import Header from './Components/Header';
import Home from './Pages/Home';
import Signin from './Pages/Signin';
import Register from './Pages/Register';
import MemberDashboard from './Pages/Dashboard/MemberDashboard/MemberDashboard.js';
import AdminDashboard from './Pages/Dashboard/AdminDashboard/AdminDashboard.js';
import Allbooks from './Pages/Allbooks';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Header />
      <div className="App">
        <Switch>
          <Route exact path='/' component={Home} />
          
          <Route exact path='/signin'>
            {user ? (
              user.isAdmin ? (
                <Redirect to='/dashboard@admin' />
              ) : (
                <Redirect to='/dashboard@member' />
              )
            ) : (
              <Signin />
            )}
          </Route>

          <Route exact path='/register'>
            {user ? <Redirect to='/' /> : <Register />}
          </Route>

          <Route exact path='/dashboard@member'>
            {user ? (
              !user.isAdmin ? <MemberDashboard /> : <Redirect to='/' />
            ) : (
              <Redirect to='/signin' />
            )}
          </Route>

          <Route exact path='/dashboard@admin'>
            {user ? (
              user.isAdmin ? <AdminDashboard /> : <Redirect to='/' />
            ) : (
              <Redirect to='/signin' />
            )}
          </Route>

          <Route exact path='/books' component={Allbooks} />
          
          <Redirect from='*' to='/' />
        </Switch>
      </div>
    </Router>
  );
}

export default App;