import { ToastContainer, toast } from 'react-toastify';

const SuccessToast = (message?: string) => {
    Toast({message: message ?? 'Request processed successfully', type: 'success'})
}

const ErrorToast = (message?: string) => {
    Toast({message: message ?? 'Something went wrong, please try again', type: 'error'})
}

const Toast = ({message, type} : {message: string, type: 'success' | 'error'}) => {
   toast[type](message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    pauseOnFocusLoss: false,
    //transition: Bounce,
   });
}

export {
    SuccessToast,
    ErrorToast,
}