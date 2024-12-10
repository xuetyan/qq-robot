export const toObject = (data) => {
  if (Buffer.isBuffer(data)) return JSON.parse(data.toString());
  if (typeof data === "object") return data;
  if (typeof data === "string") return JSON.parse(data);
};