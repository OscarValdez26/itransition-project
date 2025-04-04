import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { postRequest } from '../api/api';
import { useContext, useState } from 'react';
import { AppContext } from '../context/Provider';
import { useTranslation } from 'react-i18next';

function Login() {
    const { setUser } = useContext(AppContext);
    const { t } = useTranslation();
    const [loginError,setLoginError] = useState(false);
    const [error,setError] = useState();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const onSubmit = handleSubmit(async (values) => {
        const result = await postRequest('/login',values); 
        if(result.id > 0){
            localStorage.setItem("user",JSON.stringify(result));
            setUser(result);
            navigate('/profile');
        }
        else{
            result === "Password invalid" ? setError(t('Password_invalid')):setError(result);
            setLoginError(true);
        }
    });

    return (
            <div className='flex justify-center h-screen items-center'>
            <div className='bg-zinc-800 max-w-md p-10 rounded-md'>
                <h1 className='text-2xl text-bold text-gray-200'>{t('Login')}</h1>
                <form onSubmit={onSubmit}>
                    <input className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2' {...register("email", { required: true })} type='email' placeholder='Email' />
                    {errors.email && <p className="text-red-500">{t('Email_required')}</p>}
                    <input className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2' {...register("password", { required: true })} type='password' placeholder={t('Password')}/>
                    {errors.password && <p className="text-red-500">{t('Password_required')}</p>}
                    {loginError && <p className="text-red-500">{error}</p>}
                    <button className='text-bold text-sky-500 m-2 p-2 rounded-md bg-gray-700' type='submit'>{t('Login')}</button>
                </form>
                <p className='flex gap-x-2 justify-between text-gray-200'>
                    {t('NoAccount')} <Link to="/register" className='text-bold text-sky-500'>{t('Register')}</Link>
                </p>
            </div>
        </div>    
    );
}

export default Login;