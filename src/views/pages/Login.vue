<script setup>
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore();
const router = useRouter();
const toast = useToast();

const email = ref('');
const password = ref('');

const handleLogin = async () => {
    const success = await store.dispatch('login', {
        emailOrUserName: email.value,
        password: password.value
    });

    if (success) {
        toast.add({
            severity: 'success',
            summary: 'Başarılı',
            detail: 'Giriş başarılı, yönlendiriliyorsunuz...',
            life: 3000
        });

        router.push('/');
    }
};
</script>

<template>
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <h2 class="text-900 text-3xl font-medium mb-3">Hoş Geldiniz</h2>
                        <span class="text-600 font-medium">Giriş yapmak için bilgilerinizi giriniz</span>
                    </div>

                    <form class="" @submit.prevent="handleLogin">
                        <div class="mb-5">
                            <div class="text-900 text-xl font-medium mb-3">Email</div>
                            <InputText type="text" v-model="email" placeholder="Email adresiniz" class="w-full" required />
                        </div>

                        <div class="mb-5">
                            <div class="text-900 text-xl font-medium mb-3">Şifre</div>
                            <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>
                        </div>

                        <Button type="submit" label="Giriş Yap" class="w-full p-3 text-xl" @click="handleLogin" />
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}

.p-inputtext.p-component.p-password-input {
    width: 100% !important;
}

#pv_id_2 {
    width: 100% !important;
}
</style>
