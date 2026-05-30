<template>

    <body class="min-h-screen flex">
        <!-- Left Side - Login Form -->
        <div class="w-full xl:w-2/5 bg-white flex items-center justify-center px-4 sm:px-8 py-6 lg:py-12 relative">
            <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-5">
                <div class="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full"></div>
                <div class="absolute bottom-20 right-10 w-24 h-24 bg-purple-200 rounded-full"></div>
                <div class="absolute top-1/2 left-1/4 w-16 h-16 bg-indigo-200 rounded-full"></div>
            </div>

            <div class="w-full max-w-md relative z-10">
                <!-- Logo/Brand -->
                <div class="text-center mb-8">
                    <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
                        <StethoscopeIcon class="inline-block size-7 text-white" />
                    </div>
                    <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ appName }}</h1>
                    <p class="text-gray-600">Selamat datang di sistem kesehatan terpadu</p>
                </div>

                <!-- Login Form -->
                <div class="login-form rounded-2xl p-8 shadow-2xl">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Masuk ke Dashboard</h2>

                    <el-form @submit.prevent="onLogin" ref="addForm" :model="addData" :rules="loginRule">
                        <div class="mb-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                <Phone class="inline-block size-5 text-gray-500" />
                                No. whatsapp
                            </label>
                            <input type="text" v-model="addData.phone"
                                class="input-focus w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none transition-all duration-200"
                                placeholder="Masukkan No. whatsapp" required>
                        </div>

                        <!-- Password Input -->
                        <div class="mb-3">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                <Lock class="inline-block size-5 text-gray-500" />
                                Password
                            </label>
                            <div class="relative">
                                <input :type="togglePassword ? 'text' : 'password'" v-model="addData.password"
                                    class="input-focus w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none transition-all duration-200 pr-12"
                                    placeholder="Masukkan password" required>
                                <button type="button" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                    @click="togglePassword = !togglePassword">
                                    <EyeOff v-if="!togglePassword" class="size-4 text-gray-400" />
                                    <Eye v-else class="size-4 text-gray-400" />
                                </button>
                            </div>
                        </div>

                        <!-- Remember Me & Forgot Password -->
                        <!-- <div class="flex items-center justify-between">
                            <a href="#" class="text-sm text-blue-600 hover:text-blue-800 font-medium">Lupa password?</a>
                        </div> -->

                        <!-- Login Button -->
                        <button type="submit" class="btn-primary w-full py-3 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer">
                            <LogIn class="inline-block size-5" />
                            Masuk
                        </button>
                    </el-form>
                </div>
            </div>
        </div>

        <!-- Right Side - Medical Illustration -->
        <div class="hidden xl:flex xl:w-3/5 gradient-bg relative overflow-hidden items-center justify-center">
            <!-- Background Medical Icons -->
            <div class="absolute inset-0">
                <!-- Floating Medical Icons -->
                <div class="animate-bounce absolute top-20 left-20 medical-icon rounded-full w-20 h-20 flex items-center justify-center">
                    <i class="fas fa-stethoscope text-white text-2xl"></i>
                </div>
                <div class="floating-animation absolute top-40 right-32 medical-icon rounded-full w-16 h-16 flex items-center justify-center">
                    <i class="fas fa-pills text-white text-xl"></i>
                </div>
                <div class="floating-animation absolute bottom-32 left-32 medical-icon rounded-full w-18 h-18 flex items-center justify-center">
                    <i class="fas fa-heartbeat text-white text-xl"></i>
                </div>
                <div class="animate-pulse absolute bottom-20 right-20 medical-icon rounded-full w-16 h-16 flex items-center justify-center">
                    <i class="fas fa-user-md text-white text-xl"></i>
                </div>

                <!-- Medical Cross Pattern -->
                <div class="medical-cross absolute top-1/4 left-1/4 w-8 h-32 rounded-full"></div>
                <div class="medical-cross absolute top-1/3 left-1/4 w-32 h-8 rounded-full"></div>
                <div class="medical-cross absolute bottom-1/4 right-1/4 w-6 h-24 rounded-full"></div>
                <div class="medical-cross absolute bottom-1/3 right-1/4 w-24 h-6 rounded-full"></div>
            </div>

            <!-- Main Content -->
            <div class="relative z-10 text-center text-white px-12">
                <!-- Hospital/Clinic Illustration -->
                <div class="mb-8">
                    <div class="inline-flex items-center justify-center w-32 h-32 bg-white rounded-3xl mb-6 backdrop-blur-sm border border-white border-opacity-30">
                        <img src="/amc.png" alt="Logo" class="w-28 h-2w-28">
                    </div>
                </div>

                <!-- AMC Group Text -->
                <div class="space-y-4">
                    <h1 class="text-2xl font-bold mb-4">{{ appName }}</h1>
                    <p class="font-light mb-6 leading-relaxed">
                        Sistem Kesehatan Terpadu
                    </p>
                    <p class="text-sm opacity-90 max-w-lg mx-auto leading-relaxed">
                        Memberikan pelayanan kesehatan terbaik dengan teknologi modern dan tenaga medis profesional untuk kesehatan yang optimal.
                    </p>
                </div>

                <!-- Feature Icons -->
                <div class="flex justify-center space-x-8 mt-12">
                    <div class="text-center flex flex-col items-center">
                        <div class="medical-icon w-12 h-12 rounded-xl flex items-center justify-center mb-2">
                            <ShieldCheck class="size-5 text-white" />
                        </div>
                        <p class="text-sm opacity-80">Aman</p>
                    </div>
                    <div class="text-center flex flex-col items-center">
                        <div class="medical-icon w-12 h-12 rounded-xl flex items-center justify-center mb-2">
                            <FileClock class="size-5 text-white" />
                        </div>
                        <p class="text-sm opacity-80">24/7</p>
                    </div>
                    <div class="text-center flex flex-col items-center">
                        <div class="medical-icon w-12 h-12 rounded-xl flex items-center justify-center mb-2">
                            <Award class="size-5 text-white" />
                        </div>
                        <p class="text-sm opacity-80">Terpercaya</p>
                    </div>
                </div>
            </div>
        </div>
    </body>
</template>

<script setup>
import { loginApi } from '../api/loginApi';
import { adminMenus, allMenus, messageInfo, setAuthentication } from '../helpers/utils';
import { Award, Eye, EyeOff, FileClock, Lock, LogIn, Phone, ShieldCheck, Stethoscope, StethoscopeIcon } from 'lucide-vue-next';
import { ref } from 'vue';
import useAddData from '../composables/useAddData';
import { useRouter } from 'vue-router';
import { useAppStore } from '../store/appStore';
import { initFirebasePushNotification } from '../firebase/pushNotification';
import { loginRule } from '../rules/loginRules';

const {
    addData,
    addForm,
    addDialog,
    saveAdd,
    cancelAdd,
    requiredLabelLength,
    openDialog,
    isLoading,
} = useAddData();
const router = useRouter();

const appName = import.meta.env.VITE_APP_NAME || "AMC Group";
const togglePassword = ref(false);
const appStore = useAppStore();
const form = ref({
    phone: '',
    password: ''
});

function onLogin() {
    saveAdd(loginApi, async (data) => {
        if (data) {
            const { token, refresh_token, user } = data;
            const menus = [...allMenus, ...adminMenus];
            appStore.setMenuList(menus);
            // if (user.role === 'admin') {
            // } else {
            //     appStore.setMenuList(allMenus);
            // }
            setAuthentication(token, refresh_token);
            await initFirebasePushNotification();
            window.location.href = '/dashboard';
        } else {
            messageInfo('Login gagal, silahkan coba lagi');
        }
    });
}
</script>

<style scoped>
.gradient-bg {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.floating-animation {
    animation: float 6s ease-in-out infinite;
}

.floating-animation:nth-child(2) {
    animation-delay: 2s;
}

.floating-animation:nth-child(3) {
    animation-delay: 4s;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-20px);
    }
}

.medical-icon {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.login-form {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.input-focus:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transition: all 0.3s ease;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.medical-cross {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
}
</style>

