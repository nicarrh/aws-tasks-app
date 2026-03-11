# Proyecto Auth con AWS Cognito y React Native

Bueno, este proyecto es básicamente un ejemplo de como conectar **AWS Cognito** con **React Native** usando `amazon-cognito-identity-js` y `aws-amplify`.
Tiene un hook `useAuth` que maneja login, logout, registro, refresh de tokens y MFA.
A su vez tambien conectamos dos BBDD de dynamo mediante lambdas para ejecutar acciones basicas en las rutas que se necesitan, que las detallare mas adelante.

---

## 1. Crear User Pool y App Client en AWS Cognito

1. Entrar a la consola de **AWS Cognito** y crear un **User Pool**.
2. Durante la creación:

   - En **Authentication flows**, activé **SRP (Secure Remote Password)** y **Password**, asi se puede loguear con password normal y SRP.
   - Si usas **Hosted UI**, poner las **Allowed Callback URLs** y **Sign out URLs** que va a usar tu app (por ejemplo `exp://localhost:19000` o la url de Expo).

3. Copiar el **User Pool ID** y **App Client ID**, los vamos a usar en el `.env`.

> La doc de AWS explica todo esto: [https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools.html](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools.html)

---

## 2. Configuración de Amplify / amazon-cognito-identity-js

- Se usa:

  - `aws-amplify` v6.x
  - `amazon-cognito-identity-js` v6.x
  - `@aws-amplify/react-native` v1.x

- Configuración rápida en `App.tsx`:

```ts
Amplify.configure({
	Auth: {
		Cognito: {
			userPoolId: process.env.USER_POOL_ID,
			userPoolClientId: process.env.USER_POOL_CLIENT_ID,
			signUpVerificationMethod: 'code',
		},
	},
});
```

> Si quieres usar solo `amazon-cognito-identity-js`, recomiendan v6.x para no tener problemas con RN 0.83+.

---

## 3. Seguridad

- **Almacenamiento seguro:** se usa `expo-secure-store` para guardar los tokens (`accessToken`, `idToken`, `refreshToken`).
- **Expiración / refresh:** el hook `useAuth` revisa los tokens al iniciar y refresca automaticamente con el refresh token.
- **PII:** no se guarda ni loguea el password completo. Solo lo minimo necesario para auth.

---

## 4. Iniciar el proyecto

1. Clonar repo:

```bash
git clone https://github.com/nicarrh/aws-tasks-app.git
cd aws-tasks-app
```

2. Copiar `.env.example` a `.env` y completar con tus claves:

```bash
cp .env.example .env
```

- Poner `USER_POOL_ID` y `USER_POOL_CLIENT_ID`.

3. Instalar dependencias:

```bash
yarn
```

4. Usar Node v24 (o >= 24) para evitar errores de crypto y Amplify.

5. Correr Expo:

```bash
yarn start
```

- Para Android/iOS:

```bash
yarn android
yarn ios
```

---

## 5. Tests

- Hay tests basicos con `@testing-library/react-native`.
- Lo necesario esta mockeado para que corran bien los tests.

---

## Rutas

---

## Notas

- Nunca subir `.env` al repo.
- Esta base sirve para apps con login seguro, MFA, refresh de tokens y manejo de sesiones.
- Faltan algunas cosas, tipo mejor manejo de errores de MFA y NEW_PASSWORD_REQUIRED, pero el flujo principal funciona.

---

Principalmente la app se base en la autenticación con cognito, el CRUD para las tareas y la implementación de los diferentes flujos.
Como Recuperar contraseña, validar mediante código el login.
