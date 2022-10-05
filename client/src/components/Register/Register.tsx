import * as yup from "yup";
import { Formik } from "formik";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchRegistration } from "../../features/authSlice/fetchRegistration";

import styles from "./Register.module.css";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "../../apollo/mutations/user";
import { setNewUser } from "../../features/authSlice/authSlice";

const image =
  "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e";

export const Register = () => {
  const dispatch = useAppDispatch();
  const [newUser] = useMutation(REGISTER_USER);
  const { isApolloServer } = useAppSelector((state) => state.server);

  const validationSchema = yup.object().shape({
    email: yup.string().email("Email is invalid").required("Email is required"),
    acceptTerms: yup.bool().oneOf([true], "Accept Terms is required"),
    password: yup
      .string()
      .typeError("Should be String")
      .min(8, "Password must be at least 8 charaters")
      .required("Password is required"),
    // .matches(
    //   /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
    //   "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    // ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Password is not match")
      .required("Confirm password is required"),
    // .matches(
    //   /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
    //   "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    // ),
  });

  return (
    <>
      <Formik
        initialValues={{
          email: "",
          acceptTerms: false,
          password: "",
          confirmPassword: "",
        }}
        validateOnBlur
        onSubmit={async (values, { resetForm }) => {
          const { email, password } = values;

          if (isApolloServer) {
            dispatch(fetchRegistration({ email, password }));
          }

          if (!isApolloServer) {
            try {
              const response = await newUser({
                variables: {
                  input: { email, password },
                },
              });

              const data = await response.data?.registerUser;
              dispatch(setNewUser(data));
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
            <h3 className={styles.title}>Register</h3>

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

            <label className={styles.label}>
              <span>Confirm your password</span>

              <input
                type="password"
                name="confirmPassword"
                className={!errors.confirmPassword ? styles.input : styles["input-error"]}
                placeholder="confirm your password"
                autoComplete="off"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.confirmPassword}
              />

              {errors.confirmPassword && (
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

              {touched.confirmPassword && errors.confirmPassword && (
                <span className={styles.error}>{errors.confirmPassword}</span>
              )}
            </label>

            <label className={styles.label}>
              <div className={styles["label-checkbox"]}>
                <input
                  name="acceptTerms"
                  type="checkbox"
                  autoComplete="off"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.confirmPassword}
                />

                <span style={!errors.acceptTerms ? { color: "black" } : { color: "red" }}>
                  I have read and agree to the Terms
                </span>
              </div>

              {touched.acceptTerms && errors.acceptTerms && (
                <span className={styles.error}>{errors.acceptTerms}</span>
              )}
            </label>

            <div className={styles["wrapper-btn"]}>
              <button
                className={styles["btn-register"]}
                type="submit"
                disabled={!isValid && !dirty}
                // onClick={handleSubmit}
              >
                Register
              </button>

              <button className={styles["btn-reset"]} type="reset" onClick={() => resetForm()}>
                Reset
              </button>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
};
