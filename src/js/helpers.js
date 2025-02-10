import { TIMEOUT_SEC } from "./config";

function timeout(s) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
}

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

// export async function getJSON(url) {
//   try {
//     //? Fetch data from API
//     const response = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);

//     //? Extract recipe data from API
//     const data = await response.json();

//     //? Handle errors
//     if (!response.ok) throw new Error(`${data.message} ${response.status}`);

//     return data;
//   } catch (error) {
//     throw error;
//   }
// }

// export async function sendJSON(url, uploadData) {
//   try {
//     //? Fetch data from API
//     const fetchPromise = fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(uploadData),
//     });

//     const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);

//     //? Extract recipe data from API
//     const data = await response.json();

//     //? Handle errors
//     if (!response.ok) throw new Error(`${data.message} ${response.status}`);

//     return data;
//   } catch (error) {
//     throw error;
//   }
// }
