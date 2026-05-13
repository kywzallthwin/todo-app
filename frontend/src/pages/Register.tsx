import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})

type FormData = z.infer<typeof schema>

export default function Register() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    const res = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.email, password: data.password })
    })
    const json = await res.json()
    if (!res.ok) return alert(json.error)
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-80">
        <h1 className="text-2xl font-medium">Register</h1>

        <input {...register('email')} placeholder="Email"
          className="border rounded-lg p-2 text-sm" />
        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}

        <input {...register('password')} type="password" placeholder="Password"
          className="border rounded-lg p-2 text-sm" />
        {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}

        <input {...register('confirmPassword')} type="password" placeholder="Confirm Password"
          className="border rounded-lg p-2 text-sm" />
        {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}

        <button type="submit" className="bg-green-600 text-white rounded-lg p-2 text-sm">
          Register
        </button>

        <p className="text-xs text-center text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600">Login</Link>
        </p>
      </form>
    </div>
  )
}