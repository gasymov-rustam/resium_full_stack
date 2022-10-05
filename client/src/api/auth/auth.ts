export const login = (data: any) => {
  return new Promise((resolve, reject) => {
    const { name, password } = data;
    setTimeout(() => {
      if (name === "rustam" && password === "123456Rr$") {
        resolve({ status: 200, data: { name, token: "lksjnfdcvkjdbfjv5bfsjdhbv", role: "admin" } });
      } else {
        reject(new Error("User was not defined, please try again, status 401"));
      }
    }, 700);
  });
};
