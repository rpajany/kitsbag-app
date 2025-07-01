import axios from "../services/api";

export const safeCall = async (apiFn) => {
  try {
    const res = await apiFn();
    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
};

// const result = await safeCall(() => POST_Api(url, payload));
// if (result.success) setData(result.data);
// else toast.error(result.message);

// POST api (POST)
export const POST_Api = async (API_URL, data) => {
  try {
    // Determine Content-Type based on the data type
    const headers = {
      "Content-Type":
        data instanceof FormData ? "multipart/form-data" : "application/json",
    };

    const response = await axios.post(API_URL, data, { headers });
    console.log("Api response :", response);
    return response;
  } catch (error) {
    console.error(`POST_Api error for ${API_URL}:`, error.message);
    throw error; // ⬅️ Key: re-throw so the component can handle it
  }
};

// GET api (GET)
export const GET_Api = async (API_URL, config = {}) => {
  try {
    const response = await axios.get(API_URL, config);
    // console.log('GET ApiResponse :', response.data)
    return response;
  } catch (error) {
    console.error(`GET_Api error for ${API_URL}:`, error.message);
    throw error; // ⬅️ Key: re-throw so the component can handle it
  }
};

// Update api (PUT)
export const UPDATE_Api = async (API_URL, updatedData) => {
  try {
    const response = await axios.put(API_URL, updatedData);
    // console.log('UPDATE ApiResponse :', response)
    return response;
  } catch (error) {
    console.error(`UPDATE_Api error for ${API_URL}:`, error.message);
    throw error; // ⬅️ Key: re-throw so the component can handle it
  }
};

// Delete api (DELETE)
export const DELETE_Api = async (API_URL) => {
  try {
    const response = await axios.delete(API_URL);
    // console.log('DELETE ApiResponse :', response)
    return response;
  } catch (error) {
    console.error(`DELETE_Api error for ${API_URL}:`, error.message);
    throw error; // ⬅️ Key: re-throw so the component can handle it
  }
};

// upload file
export const Upload_APi = async (API_URL, formData) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        // ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return response;
  } catch (error) {
    console.error(`Upload_APi error for ${API_URL}:`, error.message);
    throw error; // Ensure the calling function is aware of the error
  }
};

// Correct POST_Api to handle file download
export const DOWNLOAD_Api = async (API_URL, data = {}) => {
  try {
    // Determine Content-Type based on the data type
    const headers = {
      "Content-Type":
        data instanceof FormData ? "multipart/form-data" : "application/json",
    };

    // Configure Axios to handle binary data
    const response = await axios.post(API_URL, data, {
      headers,
      responseType: "blob", // Important for downloading files
    });

    return response;
  } catch (error) {
    console.error(`DOWNLOAD_Api error for ${API_URL}:`, error.message);
    throw error; // Re-throw the error for the caller to handle
  }
};
