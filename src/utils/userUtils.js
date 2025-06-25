/**
 * Gets the initials from a user's name(s)
 * @param {Object} params - The parameters object
 * @param {string} [params.firstName] - The user's first name
 * @param {string} [params.lastName] - The user's last name
 * @param {string} [params.fullName] - The user's full name (used if firstName/lastName not provided)
 * @returns {string} The user's initials in uppercase (exactly two letters)
 */
export const getUserInitials = ({ firstName, lastName, fullName }) => {
  // If firstName and lastName are provided, use them
  if (firstName || lastName) {
    const first = firstName ? firstName.charAt(0).toUpperCase() : "";
    const last = lastName ? lastName.charAt(0).toUpperCase() : "";
    return first + last || "U";
  }

  // If fullName is provided, get initials from it (only first and last name)
  if (fullName) {
    const nameParts = fullName
      .trim()
      .split(" ")
      .filter((part) => part.length > 0);
    if (nameParts.length === 0) return "U";

    const firstInitial = nameParts[0].charAt(0).toUpperCase();
    const lastInitial =
      nameParts.length > 1
        ? nameParts[nameParts.length - 1].charAt(0).toUpperCase()
        : "";

    return firstInitial + lastInitial || "U";
  }

  // Default fallback
  return "U";
};

/**
 * Gets the full name from user's first and last name
 * @param {Object} params - The parameters object
 * @param {string} [params.firstName] - The user's first name
 * @param {string} [params.lastName] - The user's last name
 * @param {string} [params.fullName] - The user's full name (used if firstName/lastName not provided)
 * @returns {string} The user's full name
 */
export const getFullName = ({ firstName, lastName, fullName }) => {
  if (firstName || lastName) {
    return `${firstName || ""} ${lastName || ""}`.trim() || "User";
  }

  if (fullName) {
    return fullName.trim() || "User";
  }

  return "User";
};
