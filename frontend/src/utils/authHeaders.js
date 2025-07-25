import { getUserDetails } from "./GetUser";
export const authHeaders = () => {
  const userDetails = getUserDetails();
  console.log('userDetails:', userDetails); // 👈 Add this
  const userToken = userDetails?.token;

  if (userToken) {
    return {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
  } else {
    console.log('NO TOKEN FOUND!');
    return {};
  }
};
