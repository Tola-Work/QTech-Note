import * as yup from 'yup'

export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required')
})

export const registerSchema = yup.object({
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password')
})

export const noteSchema = yup.object({
  title: yup
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters')
    .required('Title is required'),
  content: yup
    .string()
    .max(10000, 'Content must be less than 10000 characters')
})

export const validateForm = async <T>(
  schema: yup.Schema<T>,
  data: any
): Promise<{ isValid: boolean; errors: Record<string, string> }> => {
  try {
    await schema.validate(data, { abortEarly: false })
    return { isValid: true, errors: {} }
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {}
      error.inner.forEach((err) => {
        if (err.path) {
          errors[err.path] = err.message
        }
      })
      return { isValid: false, errors }
    }
    return { isValid: false, errors: { form: 'Validation failed' } }
  }
} 