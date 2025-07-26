<template>
    <section class="flex items-center justify-center min-h-screen bg-slate-200">
        <div class="main bg-white rounded-lg shadow p-10 transition-transform xl:min-w-96 text-center">
            <h1 class="text-green-600 text-2xl font-semibold">
                Panel Admin
            </h1>
            <el-form @submit.prevent="onLogin" ref="addForm" :model="addData" :rules="loginRule">
                <el-form-item prop="phone">
                    <label for="first" class="block mt-4 mb-2 text-left text-gray-700 font-bold">No HP:</label>
                    <input v-model="addData.phone" type="phone" id="first" name="first" placeholder="Enter your phone" class="block w-full px-4 py-2 border
                    -gray-300 rounded-md focus:outline-none
                     focus:border-green-400" required>
                </el-form-item>
                <el-form-item prop="password">
                    <label for="password" class="block mb-2 text-left
                 text-gray-700 font-bold">Password:</label>
                    <input v-model="addData.password" type="password" id="password" name="password" placeholder="Enter your Password"
                        class="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-400" required>
                </el-form-item>
                <div class="flex justify-center items-center w-full">
                    <button type="submit" class="bg-green-600 text-white w-full py-2.5 rounded-md cursor-pointer transition-colors duration-300 hover:bg-green-500">
                        Login
                    </button>
                </div>
            </el-form>
            <p class="mt-4">Lupa Password?
                <router-link to="/reset-password" class="text-blue-500 hover:underline">Reset Password</router-link>
            </p>
        </div>
    </section>
</template>

<script setup>

import { useRouter } from 'vue-router';
import { loginApi } from '../api/loginApi';
import useAddData from '../composables/useAddData';
import { adminMenus, allMenus, messageInfo, setAuthentication } from '../helpers/utils';
import { loginRule } from '../rules/loginRules';
import { useAppStore } from '../store/appStore';

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
const appStore = useAppStore();

function onLogin() {
    saveAdd(loginApi, (data) => {
        if (data) {
            const { token, refresh_token, user } = data;
            if (user.role === 'admin') {
                appStore.setMenuList([...allMenus, ...adminMenus]);
            } else {
                appStore.setMenuList(allMenus);
            }
            setAuthentication(token, refresh_token);
            return router.push('/dashboard');
        } else {
            messageInfo('Login gagal, silahkan coba lagi');
        }
    });
}
</script>