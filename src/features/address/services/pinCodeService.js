const API_URL = "https://api.postalpincode.in/pincode";

export async function fetchPinDetails(pinCode) {
  const response = await fetch(`${API_URL}/${pinCode}`);

  if (!response.ok) {
    throw new Error("Unable to fetch PIN details.");
  }

  const data = await response.json();

  if (
    !data.length ||
    data[0].Status !== "Success" ||
    !data[0].PostOffice?.length
  ) {
    throw new Error("Invalid PIN Code.");
  }

  const office = data[0].PostOffice[0];

  return {
    state: office.State,
    city: office.District,
    postOffice: office.Name,
  };
}