import Ajv, { JSONSchemaType } from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Interface for login request
interface LoginRequest {
  email: string;
  password: string;
}

// Interface for register request
interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

// Login validation schema
export const loginSchema: JSONSchemaType<LoginRequest> = {
  type: "object",
  properties: {
    email: {
      type: "string",
      format: "email",
      minLength: 1,
    },
    password: {
      type: "string",
      minLength: 6,
    },
  },
  required: ["email", "password"],
  additionalProperties: false,
};

// Register validation schema
export const registerSchema: JSONSchemaType<RegisterRequest> = {
  type: "object",
  properties: {
    email: {
      type: "string",
      format: "email",
      minLength: 1,
    },
    password: {
      type: "string",
      minLength: 6,
      pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{6,}$", // At least one lowercase, uppercase, and number
    },
    username: {
      type: "string",
      minLength: 3,
      maxLength: 30,
      pattern: "^[a-zA-Z0-9_]+$", // Only alphanumeric characters and underscores
    },
  },
  required: ["email", "password", "username"],
  additionalProperties: false,
};

// Compile validators
export const validateLogin = ajv.compile(loginSchema);
export const validateRegister = ajv.compile(registerSchema);
