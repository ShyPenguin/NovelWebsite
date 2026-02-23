export const formatTimeAgo = (dateRelease: string) => {
  const releaseDate = new Date(dateRelease);
  const currentDate = new Date();
  const timeDiffMs = currentDate.getTime() - releaseDate.getTime();

  // Convert to different units
  const seconds = Math.floor(timeDiffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Less than 1 minute
  if (seconds < 60) {
    return "Just now";
  }

  // Less than 1 hour (show minutes)
  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }

  // Less than 24 hours (show hours)
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  // More than 24 hours (show full date)
  // Format: "Jan 15, 2024" or use your preferred format
  return `${days}/${releaseDate.getMonth() + 1}/${releaseDate.getFullYear()}`;
};
