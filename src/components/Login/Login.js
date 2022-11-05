import React, {
  useEffect,
  useReducer,
  useState,
  useContext,
  useRef,
} from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/auth-context";
import Input from "../UI/Input/Input";

const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.includes("@") };
  }
  return { value: "", isValid: false };
};

const passReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: "", isValid: false };
};

const Login = (props) => {
  const ctxAuth = useContext(AuthContext);

  // const [enteredEmail, setEnteredEmail] = useState("");
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState("");
  // const [passwordIsValid, setPasswordIsValid] = useState();

  const [formIsValid, setFormIsValid] = useState(false);

  //useState is better in this scenario than useRef because we are checking each keystroke to make the form invalid until filled out
  //the button doesn't appear clickable until you write a proper email and the password is 8 characters long

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });

  const [passState, dispatchPassword] = useReducer(passReducer, {
    value: "",
    isValid: null,
  });

  //useReducer is a better alternative to useState when there are two states that depend on a similar variable/variables
  //useReducer is destructured into two, the actual State and the dispatch which is a function
  //in useReducer the first thing passed is a function and the second one is the initial information
  //there is an optional third thing to pass which is the initial function

  // useEffect(() => {
  //   console.log('running')
  // })

  // because there is no second parameter, this would run every time the function rerenders

  // useEffect(() => {
  //   console.log('running two')
  // }, [])

  // since there is an empty array, this will now only run once at the start (usually useEffect will do this)
  // because the empty array doesn't change, it wont cause it to rerender

  const { isValid: emailIsValid } = emailState;
  const { isValid: passIsValid } = passState;
  //this is a method of array destructuring and assigning an alias

  useEffect(() => {
    const identifier = setTimeout(() => {
      setFormIsValid(
        emailIsValid && passIsValid
        //this will send true if both values are true, if not it will send false
      );

      return () => {
        clearTimeout(identifier);
        //there is a timer set for each keystroke but this function runs before a new one starts and therefore
        //it clears the last timer leaving only the last one so only the last one is sent
        //this is useful if you want to do a http request
      };
      //this is a useEffect cleanup
    }, 500);
  }, [emailIsValid, passIsValid]);

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });

    // setEnteredEmail(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: "USER_INPUT", val: event.target.value });

    // setEnteredPassword(event.target.value);
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "INPUT_BLUR" });
    // setEmailIsValid(enteredEmail.includes("@"));
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: "INPUT_BLUR" });
    // setPasswordIsValid(enteredPassword.trim().length > 6);
  };

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid) {
      ctxAuth.onLogin(emailState.value, passState.value);
    } else if (!emailIsValid) {
      emailInputRef.current.focus();
    } else {
      passwordInputRef.current.focus();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailInputRef}
          id="email"
          label="E-mail"
          type="email"
          isValid={emailIsValid}
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />

        <Input
          ref={passwordInputRef}
          id="password"
          label="Password"
          type="password"
          isValid={passIsValid}
          value={passState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />

        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
