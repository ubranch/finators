import { z } from 'zod';
import { createTsForm, useTsController, useDescription } from '@ts-react/form';

// Define Zod schemas for login and registration
const loginSchema = z.object({
  email: z.string().email('Invalid email address').describe('Email'),
  password: z.string().min(6, 'Password must be at least 6 characters').describe('Password'),
});

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').describe('Username'),
  email: z.string().email('Invalid email address').describe('Email'),
  password: z.string().min(6, 'Password must be at least 6 characters').describe('Password'),
  passwordConfirm: z.string().min(6, 'Password must be at least 6 characters').describe('Confirm Password'),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ["passwordConfirm"],
});

// Create form components
function TextField() {
  const { field, error } = useTsController<string>();
  const { label } = useDescription();
  return (
    <div className="mb-2">
      <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
      <input
        type={label?.toLowerCase().includes('password') ? 'password' : 'text'}
        value={field.value ?? ''}
        onChange={(e) => field.onChange(e.target.value)}
        className={`w-full p-2 border bg-background text-foreground rounded-sm ${
          error ? 'border-destructive border-2' : 'border-input'
        }`}
      />
      {error && <span className="text-destructive text-sm mt-1">{error.errorMessage}</span>}
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
