import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { postRequest } from '../api/api';
import { useContext, useState } from 'react';
import { AppContext } from '../context/Provider';
import { useTranslation } from 'react-i18next';

function Register() {
    const { setUser } = useContext(AppContext);
    const { t } = useTranslation();
    const [registerError, setRegisterError] = useState(false);
    const [error, setError] = useState();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const onSubmit = handleSubmit(async (values) => {
        if (values.password === values.confpassword) {
            setRegisterError(false);
            const result = await postRequest('/register', values);
            if (result.id > 0) {
                localStorage.setItem("user",JSON.stringify(result));
                setUser(result);
                navigate('/profile');
            }
            else {
                result === "User already exist" ? setError(t('Already_exist')):setError(result);
                setRegisterError(true);
            }
        }
        else {
            setRegisterError(true);
            setError(t('Password_not_match'));
        }
    });
    return (
        <div className='flex justify-center h-screen items-center'>
            <div className='bg-zinc-800 max-w-md p-10 rounded-md'>
                <h1 className='text-2xl text-bold text-gray-200'>{t('Register')}</h1>
                <form onSubmit={onSubmit}>
                    <input className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2' {...register("name", { required: true })} placeholder={t('Username')} />
                    {errors.name && <p className="text-red-500">{t('Username_required')}</p>}
                    <input className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2' {...register("email", { required: true })} type='email' placeholder='Email' />
                    {errors.email && <p className="text-red-500">{t('Email_required')}</p>}
                    <input className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2' {...register("password", { required: true })} type='password' placeholder={t('Password')} />
                    {errors.password && <p className="text-red-500">{t('Password_required')}</p>}
                    <input className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2' {...register("confpassword", { required: true })} type='password' placeholder={t('Comfirm')} />
                    {errors.password && <p className="text-red-500">{t('Comfirm_required')}</p>}
                    {registerError && <p className="text-red-500">{error}</p>}
                    <button className='text-bold text-sky-500 m-2 p-2 rounded-md bg-gray-700' type='submit'>{t('Register')}</button>
                </form>
                <p className='flex gap-x-2 justify-between text-gray-200'>
                    {t('Already')} <Link to="/login" className='text-bold text-sky-500'>{t('Login')}</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;