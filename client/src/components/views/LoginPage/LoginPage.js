// import Axios from "axios";
import React ,{useState} from "react";
import {useDispatch} from 'react-redux';
import {loginUser} from '../../../_actions/user_action';
import {withRouter} from 'react-router-dom';
function LoginPage(props) {
  const dispatch = useDispatch();
  const [Email, setEmail] = useState("");   // useState를 통해서 state관리
  const [Password, setPassword] = useState("");

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value) 
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }
  const onSubmitHandler = (event) => {
    event.preventDefault(); // Page의 Refresh를 방지해준다.

    let body = {
      email:Email,
      password:Password,
    }
    //dispatch 를
    dispatch(loginUser(body))
    .then(response => {
      if (response.payload.loginSuccess) {
          props.history.push('/')
      } else {
          alert('Error˝')
      }
  });

    /**
     * Axios를 활용해서도 가능하지만 redux를 사용하고 있으므로,,,
     */
    // Axios.post('/api/users/login',body)
    // .then(response=>{

    // })
  }
      
  return (
    <div
      style={{
        display: "flex",justifyContent: "center",alignItems: "center",
        width: "100%",height: "100vh",
      }}
    >
      <form style={{display:'flex',flexDirection:'column'}}
                      onSubmit={onSubmitHandler}>
        <label>Email</label>
        <input type="email" value={Email} onChange ={onEmailHandler} />
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default withRouter(LoginPage);
