export const VideoConferenceStyles = `
  .camera-list{
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }
  
  .sv-meeting-spectator-list {
    display: none;
  }
  .meeting-room__cameras__button .sv-icon-grid_md{
    display:none !important;
 }

 .meeting-container:has(.meeting-settings) {
    background-color: rgba(0, 0, 0, 0.85);
 }
`;

export const connectionStatus = {
  NOT_AVAILABLE: 0, // Indicates that the audio/video service is disconnected.
  GOOD: 1, // Represents good connection quality, ensuring a stable and reliable audio/video experience.
  BAD: 2, // Indicates a bad connection quality, suggested to turn off video to enhance experience.
  POOR: 3, // Signifies poor connection due to network or PC specs.
  DISCONNECTED: 4, // Indicates that audio/video transmission has been interrupted for at least 10 seconds.
  RECONNECTING: 5, // Occurs during a reconnection process after a loss of connection.
  LOST_CONNECTION: 6, // Indicates a complete loss of connection to the audio/video service.
};

export const LANGUAGES = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python: "3.10.0",
} as const;

export const SNIPPETS = {
  javascript: `\n// Find the sum of all numbers in an array\nfunction sumArray(arr) {\n\treturn arr.reduce((sum, num) => sum + num, 0);\n}\n\nconsole.log(sumArray([1, 2, 3, 4])); // Output: 10\n`,
  typescript: `\n// Check if a string is a palindrome\ntype Params = {\n\tinput: string;\n}\n\nfunction isPalindrome({ input }: Params): boolean {\n\tconst reversed = input.split("").reverse().join("");\n\treturn input === reversed;\n}\n\nconsole.log(isPalindrome({ input: "radar" })); // Output: true\n`,
  python: `\n# Find the factorial of a number\ndef factorial(n):\n\tif n == 0 or n == 1:\n\t\treturn 1\n\telse:\n\t\treturn n * factorial(n - 1)\n\nprint(factorial(5)) # Output: 120\n`,
} as const;
