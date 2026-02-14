import styles from './InternetShop.module.css'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { loginUser, registerUser } from '../../components'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const passwordRules = yup
  .string()
  .min(8, 'Минимум 8 символов')
  .max(50, 'Максимум 50 символов')
  .matches(/[A-Z]/, 'Хотя бы одна заглавная буква')
  .matches(/[0-9]/, 'Хотя бы одна цифра')
  .matches(/[!@#$%^&*]/, 'Хотя бы один спецсимвол')

const schemaRegister = yup.object({
  firstName: yup.string().required('Имя обязательно'),
  lastName: yup.string().required('Фамилия обязательна'),
  age: yup
    .number()
    .typeError('Введите возраст')
    .min(12, 'Минимум 12 лет'),
  login: yup.string().required('Логин обязателен'),
  password: passwordRules.required('Пароль обязателен'),
  remember: yup.boolean()
})

const schemaLogin = yup.object({
  login: yup.string().required('Введите логин'),
  password: yup.string().required('Введите пароль'),
  remember: yup.boolean()
})

export const FormRegisterShop = ({ mode, close = () => {} }) => {
  const schema = mode === 'login' ? schemaLogin : schemaRegister
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [authError, setAuthError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema, { abortEarly: false })
  })

  const onSubmit = async data => {
    const { ...payload } = data
    setAuthError('')

    try {
      if (mode === 'login') {
        await dispatch(loginUser(payload))
        close()
        navigate('/shop/profile')
        return
      }

      await dispatch(registerUser(payload))
      close()
      navigate('/shop/profile')
    } catch (e) {
  const status = e?.response?.status

  if (status === 401 || status === 404) {
    setAuthError('Неверный логин или пароль')
  } else {
    setAuthError('Ошибка сервера')
  }
}
  }

  return (
    <div className={styles.registerWrapper}>
      <button
        className={styles.backButtonSmall}
        onClick={close}
      >
        ← Назад
      </button>

      <form
        className={styles.registerForm}
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2>
          {mode === 'login' ? 'Вход' : 'Регистрация'}
        </h2>

        {mode === 'register' && (
          <>
            <input
              {...register('firstName')}
              placeholder="Имя"
            />
            <span>{errors.firstName?.message}</span>

            <input
              {...register('lastName')}
              placeholder="Фамилия"
            />
            <span>{errors.lastName?.message}</span>

            <input
              type="number"
              {...register('age')}
              placeholder="Возраст"
            />
            <span>{errors.age?.message}</span>
          </>
        )}

        <input
          {...register('login')}
          placeholder="Логин"
        />
        <span>{errors.login?.message}</span>

        <input
          type="password"
          {...register('password')}
          placeholder="Пароль"
        />
        <span>{errors.password?.message}</span>

        <label className={styles.remember}>
          <input
            type="checkbox"
            {...register('remember')}
          />
          Запомнить меня
        </label>

        <button type="submit">
          {mode === 'login'
            ? 'Войти'
            : 'Зарегистрироваться'}
        </button>

        {authError && (
          <div className={styles.authError}>
            {authError}
          </div>
        )}
      </form>
    </div>
  )
}
