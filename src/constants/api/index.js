const LIVE_URL = 'http://imaginesmarthome.com/android_api.php?Apikey=ADMIN@123456789&';
const BASE_URL = LIVE_URL;
export const API_LOGIN = `${BASE_URL}Action=VALIDATE_USER&`;
export const API_REGISTER = `${BASE_URL}Action=ADD_USER&`;
export const API_CONTROL_DEVICE = `${BASE_URL}Action=CONTROL_DEVICE&`;
export const API_DEVICE_REGISTER = `${BASE_URL}Action=REGISTER_DEVICE&`;
export const API_GET_DEVICES = `${BASE_URL}Action=GET_DEVICE&`;
export const API_UPDATE_DEVICE = `${BASE_URL}Action=UPDATE_DEVICE&`;
export const API_DELETE_DEVICE = `${BASE_URL}Action=DELETE_DEVICE&`;
export const API_5 = `${BASE_URL}api5`;

//http://imaginesmarthome.com/android_api.php?Apikey=ADMIN@123456789&Action=
//DELETE_DEVICE&REG_USER=7600016941&Device_serial=00D4E4F0-FN1

