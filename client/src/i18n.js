import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useFormClassNames } from 'rsuite';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          Welcome: "Welcome",
          Login: "Login",
          Password: "Password",
          Register: "Register",
          NoAccount: "Do not have an account?",
          Username: "Username",
          Comfirm: "Comfirm password",
          Already: "Already have an account?"
          // Otras traducciones...
        }
      },
      es: {
        translation: {
          Welcome: "Bienvenido",
          Login: "Iniciar Sesion",
          Password: "Contraseña",
          Register: "Registrar",
          NoAccount: "¿No tienes una cuenta?",
          Username: "Nombre de usuario",
          Comfirm: "Confirmacion de contraseña",
          Already: "¿Ya tienes una cuenta?"
          // Otras traducciones...
        }
      }
      // Puedes agregar más idiomas aquí...
    },
    lng: "en", // Idioma por defecto
    fallbackLng: "en", // Idioma de reserva
    interpolation: {
      escapeValue: false // React ya hace esto
    }
  });

export default i18n;