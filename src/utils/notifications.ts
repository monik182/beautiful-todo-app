import { toaster } from '../components/ui/toaster'

export const notifyError = (message: string) => {
  toaster.create({
    title: message,
    type: 'error',
  })
}

export const notifySuccess = (message: string) => {
  toaster.create({
    title: message,
    type: 'success',
  })
}

export const notifyWarning = (message: string) => {
  toaster.create({
    title: message,
    type: 'warning',
  })
}

export const notifyInfo = (message: string) => {
  toaster.create({
    title: message,
    type: 'info',
  })
}
