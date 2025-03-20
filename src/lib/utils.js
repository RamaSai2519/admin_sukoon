import axios from "axios";
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"



export const createMeetingForEvent = async ({
  topic = '[dev] Therapy Session',
  duration = 90,
  startTime = '2025-03-20T21:30:00Z',
  isPublic = true,
  recordingEnabled = true
} = {}) => {
  // Hardcoded timezone
  const timezone = 'Asia/Kolkata';

  try {
    const data = JSON.stringify({
      topic,
      duration,
      start_time: startTime,
      timezone,
      isPublic,
      recordingEnabled
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://americano.sukoonunlimited.com/api/meetings',
      headers: {
        'Content-Type': 'application/json'
      },
      data
    };

    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
