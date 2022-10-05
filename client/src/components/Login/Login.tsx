import * as yup from "yup";
import { FC } from "react";
import { Formik } from "formik";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchLogin } from "../../features/authSlice/fetchLogin";

import styles from "./Login.module.css";
import { setCredentials } from "../../features/authSlice/authSlice";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../../apollo/mutations/user";
import { client } from "../../utils/createApolloClient";

const image =
  "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e";

export const Login: FC = () => {
  const [loginUser] = useMutation(LOGIN_USER);
  const { error, user } = useAppSelector((state) => state.auth);
  const { isApolloServer } = useAppSelector((state) => state.server);
  const dispatch = useAppDispatch();

  const validationSchema = yup.object().shape({
    email: yup.string().email("Email is invalid").required("Email is required"),
    password: yup
      .string()
      .typeError("Should be String")
      .min(8, "Password must be at least 8 charaters")
      .max(20, "Password must be 12 characters or less")
      .required("Password is required"),
    // .matches(
    //   /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
    //   "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    // ),
  });

  return (
    <>
      <div className={styles.container}>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validateOnBlur
          onSubmit={async (values, { resetForm }) => {
            const { email, password } = values;

            if (isApolloServer) {
              dispatch(fetchLogin({ email, password }));
            }

            if (!isApolloServer) {
              try {
                const response = await loginUser({
                  variables: {
                    input: { email, password },
                  },
                });

                const data = await response.data?.loginUser;

                dispatch(setCredentials(data));
                client.resetStore();
                console.log("reset");
              } catch (error) {
                throw new Error();
              }
            }

            resetForm();
          }}
          validationSchema={validationSchema}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isValid,
            handleSubmit,
            dirty,
            resetForm,
          }) => (
            <form className={styles.wrapper} autoComplete="off" onSubmit={handleSubmit}>
              <h3 className={styles.title}>Log In</h3>
              {user?.user && !user?.user?.isActivated && (
                <h3 className={styles.verify}>please verify your account</h3>
              )}

              <label className={styles.label}>
                <span>Your email</span>
                <input
                  type="email"
                  name="email"
                  className={!errors.email ? styles.input : styles["input-error"]}
                  placeholder="your email"
                  autoComplete={"off"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
                {errors.email && (
                  <img
                    src={image}
                    className={styles.img}
                    loading="lazy"
                    width="20"
                    height="20"
                    alt="what`s wrong with downloading"
                    decoding="async"
                  />
                )}
                {touched.email && errors.email && (
                  <span className={styles.error}>{errors.email}</span>
                )}
              </label>

              <label className={styles.label}>
                <span>Password</span>
                <input
                  type="password"
                  name="password"
                  className={!errors.password ? styles.input : styles["input-error"]}
                  placeholder="password"
                  autoComplete="off"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                />
                {errors.password && (
                  <img
                    src={image}
                    className={styles.img}
                    loading="lazy"
                    width="20"
                    height="20"
                    alt="what`s wrong with downloading"
                    decoding="async"
                  />
                )}
                {touched.password && errors.password && (
                  <span className={styles.error}>{errors.password}</span>
                )}
              </label>

              <div className={styles["wrapper-btn"]}>
                <button
                  className={styles["btn-register"]}
                  type="submit"
                  disabled={!isValid && !dirty}
                >
                  Sign In
                </button>

                <button className={styles["btn-reset"]} type="reset" onClick={() => resetForm()}>
                  Reset
                </button>
              </div>

              <div className={styles["wrapper__register-link"]}>
                Yoy dont have account:
                <NavLink to={"/register"} exact={true} className={styles.register}>
                  Register
                </NavLink>
              </div>
              {error && <div className={styles["error-user"]}>{error}</div>}
            </form>
          )}
        </Formik>
      </div>
    </>
  );
};
