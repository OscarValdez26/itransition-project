import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { postRequest } from '../api/api';
import { useContext, useState } from 'react';
import { AppContext } from '../context/Provider';

function Register() {
    const { setUser } = useContext(AppContext);
    const [registerError, setRegisterError] = useState(false);
    const [error, setError] = useState();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const onSubmit = handleSubmit(async (values) => {
        if (values.password === values.confpassword) {
            setRegisterError(false);
            const result = await postRequest('/register', values);
            if (result.id > 0) {
                setUser(result);
                localStorage.setItem("userId", result.id);
                localStorage.setItem("userName", result.name);
                localStorage.setItem("userEmail", result.email);
                navigate('/profile');
            }
            else {
                setError(result);
                setRegisterError(true);
            }
        }
        else {
            setRegisterError(true);
            setError("Password does not match");
        }
    });
    return (
        <div className='flex justify-center h-screen items-center'>
            <div className='bg-zinc-800 max-w-md p-10 rounded-md'>
                <h1 className='text-2xl text-bold text-gray-200'>Register</h1>
                <form onSubmit={onSubmit}>
                    <input className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2' {...register("name", { required: true })} placeholder='Username' />
                    {errors.name && <p className="text-red-500">Username is required</p>}
                    <input className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2' {...register("email", { required: true })} type='email' placeholder='Email' />
                    {errors.email && <p className="text-red-500">Email is required</p>}
                    <input className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2' {...register("password", { required: true })} type='password' placeholder='Password' />
                    {errors.password && <p className="text-red-500">Password is required</p>}
                    <input className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2' {...register("confpassword", { required: true })} type='password' placeholder='Confirm password' />
                    {errors.password && <p className="text-red-500">Confirm password is required</p>}
                    {registerError && <p className="text-red-500">{error}</p>}
                    <button className='text-bold text-sky-500 m-2 p-2 rounded-md bg-gray-700' type='submit'>Register</button>
                </form>
                <p className='flex gap-x-2 justify-between text-gray-200'>
                    Already have an account? <Link to="/login" className='text-bold text-sky-500'>Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;