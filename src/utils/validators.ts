/**
 * Validates if the user is at least 18 years old.
 * Must be 18 as of January 1st of the current year (Standard ECI rule).
 */
export const validateVoterAge = (dob: string | Date): boolean => {
  const birthDate = new Date(dob);
  const referenceDate = new Date(new Date().getFullYear(), 0, 1); // Jan 1st
  
  let age = referenceDate.getFullYear() - birthDate.getFullYear();
  const m = referenceDate.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && referenceDate.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 18;
};

/**
 * Validates Aadhaar Number format (12 digits, no alphabets)
 */
export const validateAadhaar = (aadhaar: string): boolean => {
  const aadhaarRegex = /^[2-9]{1}[0-9]{11}$/;
  return aadhaarRegex.test(aadhaar);
};

/**
 * Validates EPIC number format (Voter ID)
 * Format: 3 Alphabets followed by 7 Digits
 */
export const validateEPICNumber = (epic: string): boolean => {
  const epicRegex = /^[A-Z]{3}[0-9]{7}$/;
  return epicRegex.test(epic.toUpperCase());
};
