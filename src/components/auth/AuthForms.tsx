import { z } from 'zod';
import { createTsForm, useTsController, useDescription } from '@ts-react/form';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

// Define Zod schemas for login and registration
const loginSchema = z.object({
  email: z.string().email('Invalid email address').describe('Email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Must contain at least one special character')
    .describe('Password'),
});

const registerSchema = z.object({
  username: z.string().min(6, 'Username must be at least 6 characters').describe('Username'),
  email: z.string().email('Invalid email address').describe('Email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Must contain at least one special character')
    .describe('Password'),
  passwordConfirm: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .describe('Confirm Password'),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ["passwordConfirm"],
});

// New component for the password visibility toggle button
const PasswordToggle = ({ showPassword, togglePassword }: { showPassword: boolean; togglePassword: () => void }) => (
  <button
    type="button"
    onClick={togglePassword}
    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
  >
    {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
  </button>
);

// New component for the input field
const InputField = ({ type, value, onChange, placeholder, error }: {
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error: boolean;
}) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className={`w-full p-2 pr-10 border bg-background text-foreground rounded-sm ${
      error ? 'border-destructive border-2' : 'border-input'
    }`}
  />
);

// New component for the error message
const ErrorMessage = ({ message }: { message: string }) => (
  <span className="text-destructive text-sm mt-1">{message}</span>
);

// Refactored TextField component
function TextField({ showPassword, setShowPassword }: Readonly<{ showPassword?: boolean; setShowPassword?: (show: boolean) => void }>) {
  const { field, error } = useTsController<string>();
  const { label } = useDescription();

  const isPassword = label?.toLowerCase().includes('password');
  let inputType = 'text';
  if (isPassword) {
    inputType = showPassword ? 'text' : 'password';
  }
  const placeholder = `Enter ${label?.toLowerCase()}`;

  const togglePassword = () => setShowPassword?.(!showPassword);

  return (
    <div className="mb-4 relative">
      <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
      <div className="relative">
        <InputField
          type={inputType}
          value={field.value ?? ''}
          onChange={field.onChange}
          placeholder={placeholder}
          error={!!error}
        />
        {isPassword && setShowPassword && (
          <PasswordToggle showPassword={showPassword!} togglePassword={togglePassword} />
        )}
      </div>
      {error && <ErrorMessage message={error.errorMessage} />}
    </div>
  );
}

// Create the form components
const mapping = [
  [z.string(), TextField],
] as const;

export const LoginForm = createTsForm(mapping);
export const RegisterForm = createTsForm(mapping);

// Types for form data
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

// Schemas for export
export { loginSchema, registerSchema };
