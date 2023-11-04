import { auth } from './config';
// import { parseErrorMessage } from '/validations/parseFirebaseLoginErrors';
// import { toast } from 'react-toastify';

export const signInWithEmailAndPassword = (data) => {
	const { email, password, toast, callback, onError } = data;

	return auth.signInWithEmailAndPassword(email, password)
		.then(result => {
			if (result.user.emailVerified) {
				callback();
			} else {
				auth.signOut();
        toast('Por favor, verifica tu email.', 'warning');
			}
		})
		.catch((error) => {
			// toast(error.message, "danger");
			// onError();
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

export const createUser = (data) => {
	const { email, password, toast, callback, onError } = data;
	auth.createUserWithEmailAndPassword(email, password)
		.then((firebaseUser) => {
			auth.useDeviceLanguage();
			setTimeout(() => {
				firebaseUser.user.sendEmailVerification()
					.then(() => {
						toast("Te hemos enviado un email de verificación. Por favor, comprueba tu bandeja de entrada.", 'warning');
						callback(firebaseUser.user);
					})
					.catch((error) => {
						toast(error.message, 'danger');
						onError();
					});
			}, 1000)

			if (!firebaseUser.user.emailVerified) {
					auth.signOut();
			} else {
					// TODO: ask to verify email
			}
		})
		.catch((error) => {
			// toast(parseErrorMessage(error), { type: 'error' });
			onError();
		});
};
