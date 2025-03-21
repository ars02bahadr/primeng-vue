class ErrorService {
    toast = null;

    setToastInstance(toast) {
        this.toast = toast;
    }

    errorHandler(error) {
        if (!error.response) {
            this.toast.add({
                severity: 'error',
                summary: 'Hata',
                detail: 'API adresine ulaşılamıyor',
                life: 3000
            });
            return;
        }

        switch (error.response.status) {
            case 403:
                let errorMessage = error.response.data?.ErrorMessages?.join('\n') || 'Yetkisiz erişim';
                this.toast.add({
                    severity: 'error',
                    summary: 'Hata',
                    detail: errorMessage,
                    life: 3000
                });
                break;

            case 404:
                this.toast.add({
                    severity: 'error',
                    summary: 'Hata',
                    detail: 'API adresi bulunamadı',
                    life: 3000
                });
                break;

            case 500:
                this.toast.add({
                    severity: 'error',
                    summary: 'Hata',
                    detail: error.response.data?.errorMessages?.[0] || 'Sunucu hatası',
                    life: 3000
                });
                break;

            default:
                this.toast.add({
                    severity: 'error',
                    summary: 'Hata',
                    detail: 'Beklenmeyen bir hata oluştu',
                    life: 3000
                });
                break;
        }
    }
}

const errorService = new ErrorService();
export default errorService;
