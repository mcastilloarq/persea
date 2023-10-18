import { auth } from './config';
import { save } from './db';
// import { parseErrorMessage } from '/validations/parseFirebaseLoginErrors';

export const signInWithEmailAndPassword = (data) => {
	const { email, password, toast, callback, onError } = data;

	return auth.signInWithEmailAndPassword(email, password)
		.then(result => {
			if (result.user.emailVerified) {
				callback(result.user);
			} else {
				auth.signOut();
        toast('Por favor, verifica tu email.', 'warning');
			}
		})
		.catch((error) => {
			toast(error.message, "danger");
			onError();
		});
};
    
export const resetPassword = (data) => {
	const { email, toast, callback, onError } = data;

	auth.sendPasswordResetEmail(email)
		.then(() => {
			toast("Te hemos enviado un email para que recuperes tu contraseña. Por favor, comprueba tu bandeja de entrada.", 'warning');
			callback();
		})
		.catch((error) => {
			toast(error.message, 'danger');
			onError();
		});
};

export const updatePassword = (data) => {
	const { password, toast, callback, onError } = data;

	auth.currentUser.updatePassword(password)
		.then(() => {
			toast("Tu contraseña ha sido actualizada correctamente.", 'success');
			callback();
		})
		.catch((error) => {
			toast(error.message, 'danger');
			onError();
		});
}

export const onAuthStateChanged = (callback) => {
  return auth.onAuthStateChanged(callback);
};

export const signOut = (callback) => {
  auth.signOut();
	callback();
};

export const createUser = async (data) => {
	const { email, password, toast, callback, onError } = data;

  try {
    const firebaseUser = await auth.createUserWithEmailAndPassword(email, password);
    auth.useDeviceLanguage();
    await firebaseUser.user.sendEmailVerification();
    toast("Te hemos enviado un email de verificación. Por favor, comprueba tu bandeja de entrada.", 'warning');

    if (callback) {
      callback(firebaseUser.user);
    }

    const { uid, displayName } = firebaseUser.user;
    console.log('createUser uid:', uid);
    console.log('createUser displayName:', displayName);

    if (!firebaseUser.user.emailVerified) {
      auth.signOut();
    } else {
      // TODO: ask to verify email
    }
  } catch (error) {
    console.error('createUser error', error);
  }
};

export const getToken = async () => {
	// wait for firebase auth to initialize and get token
	const token = await new Promise((resolve, reject) => {
	  const unsubscribe = auth.onAuthStateChanged(async (u) => {
		unsubscribe()
		if (u) {
		  try {
			const t = await u.getIdToken()
			resolve(t)
		  } catch (err) {
			reject(err)
		  }
		} else {
		  resolve(null)
		}
	  }, reject)
	})

	return token;
};
