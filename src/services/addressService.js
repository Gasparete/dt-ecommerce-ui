import * as addressApi  from "../api/addressApi";

export async function getAddressByZipCode(zipCode) {
  return (await addressApi.getAddressByZipCode(zipCode)).data;
}