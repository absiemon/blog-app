import { DeviceDetails } from "../types/types";

/**
 * Fetching device details including IP address, browser name, and OS platform.
 * @returns {Promise<DeviceDetails>} - A promise that resolves to an object containing device details.
 */
export async function getDeviceDetails(): Promise<DeviceDetails> {
    // Fetch IP address
    // const response = await axios.get<{ ip: string }>('https://api.ipify.org?format=json');
    // const ip_address: string = response.data?.ip || 'Unknown';
    const ip_address: string = '1.0.0.0';

    // Extract browser name and OS platform from navigator.userAgent
    const userAgent = navigator.userAgent;
    let device_name: string | undefined;
    let platform: string | undefined;

    // Detect browser name
    if (userAgent.includes("Firefox")) {
        device_name = "Firefox";
    }
    else if (userAgent.includes("Edg")) {
        device_name = "Microsoft Edge";
    }
    else if (userAgent.includes("Chrome")) {
        device_name = "Chrome";
    }
    else if (userAgent.includes("Safari")) {
        device_name = "Safari";
    }
    else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
        device_name = "Opera";
    }
    else {
        device_name = "Unknown";
    }

    // Detect OS platform
    if (userAgent.includes("Windows")) {
        platform = "Windows";
    }
    else if (userAgent.includes("Mac OS")) {
        platform = "macOS";
    }
    else if (userAgent.includes("Linux")) {
        platform = "Linux";
    }
    else if (userAgent.includes("Android")) {
        platform = "Android";
    }
    else if (userAgent.includes("iOS")) {
        platform = "iOS";
    }
    else {
        platform = "Unknown";
    }

    // Return the device details object
    return { ip_address, device_name, platform };
}