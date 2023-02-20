// This contains sanitize() method to sanitize the input form data

exports.sanitize = (input) => {
  if (typeof input === "string") {
    return input.replace(/\<script\>/gi, ""); // Remove <script> tags
  }
  return input;
};
