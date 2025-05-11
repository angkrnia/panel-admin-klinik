<template>
    <!-- Pilih Metode Pembayaran -->
    <el-dialog v-model="modelValue" title="Masukan Pembayaran" width="500" top="5vh">
        <el-form :model="addData" ref="addForm">
            <!-- Payment Info -->
            <div class="mb-6 bg-gray-50 p-4 rounded-lg">
                <div class="flex justify-between mb-2">
                    <span class="text-gray-600">Total Transaksi:</span>
                    <span class="font-semibold">{{ convertRp(props.grandTotal) }}</span>
                </div>
            </div>

            <!-- Payment Method Selection -->
            <el-form-item class="mb-6" prop="payment_method" :rules="[{ required: true, message: 'Metode pembayaran harus dipilih', trigger: 'change' }]">
                <div class="w-full">
                    <label class="block text-gray-700 font-medium mb-2">Metode Pembayaran</label>
                    <el-radio-group class="grid grid-cols-2 gap-3" v-model="addData.payment_method">
                        <label class="flex flex-1 min-w-28 items-center bg-white border rounded-lg px-3 cursor-pointer hover:bg-blue-50">
                            <el-radio value="CASH">Cash</el-radio>
                        </label>
                        <label class="flex flex-1 min-w-28 items-center bg-white border rounded-lg px-3 cursor-pointer hover:bg-blue-50">
                            <el-radio value="TRANSFER">Transfer</el-radio>
                        </label>
                        <label class="flex flex-1 min-w-28 items-center bg-white border rounded-lg px-3 cursor-pointer hover:bg-blue-50">
                            <el-radio value="QRIS">Qris</el-radio>
                        </label>
                        <label class="flex flex-1 min-w-28 items-center bg-white border rounded-lg px-3 cursor-pointer hover:bg-blue-50">
                            <el-radio value="CREDIT">Kredit</el-radio>
                        </label>
                        <label class="flex flex-1 min-w-28 items-center bg-white border rounded-lg px-3 cursor-pointer hover:bg-blue-50">
                            <el-radio value="OTHERS">Lainnya</el-radio>
                        </label>
                    </el-radio-group>
                </div>
            </el-form-item>

            <!-- Payment Amount Input -->
            <div class="mb-6">
                <label for="payment_amount" class="block text-gray-700 font-medium mb-2">Nominal Pembayaran</label>
                <div class="relative">
                    <ElCurrencyInput v-model="addData.paid_amount" />
                </div>

                <!-- Quick Amount Buttons -->
                <div class="grid grid-cols-3 gap-2 mt-3">
                    <button @click.prevent="onInputPayment(props.grandTotal)" type="button" class="bg-gray-100 hover:bg-gray-200 py-2 rounded-md text-gray-700">Uang
                        Pas</button>
                    <button @click.prevent="onInputPayment(5000)" type="button" class="bg-gray-100 hover:bg-gray-200 py-2 rounded-md text-gray-700">5 Ribu</button>
                    <button @click.prevent="onInputPayment(10000)" type="button" class="bg-gray-100 hover:bg-gray-200 py-2 rounded-md text-gray-700">10 Ribu</button>
                    <button @click.prevent="onInputPayment(20000)" type="button" class="bg-gray-100 hover:bg-gray-200 py-2 rounded-md text-gray-700">20 Ribu</button>
                    <button @click.prevent="onInputPayment(25000)" type="button" class="bg-gray-100 hover:bg-gray-200 py-2 rounded-md text-gray-700">25 Ribu</button>
                    <button @click.prevent="onInputPayment(50000)" type="button" class="bg-gray-100 hover:bg-gray-200 py-2 rounded-md text-gray-700">50 Ribu</button>
                    <button @click.prevent="onInputPayment(75000)" type="button" class="bg-gray-100 hover:bg-gray-200 py-2 rounded-md text-gray-700">75 Ribu</button>
                    <button @click.prevent="onInputPayment(100000)" type="button" class="bg-gray-100 hover:bg-gray-200 py-2 rounded-md text-gray-700">100 Ribu</button>
                    <button @click.prevent="onInputPayment(200000)" type="button" class="bg-gray-100 hover:bg-gray-200 py-2 rounded-md text-gray-700">200 Ribu</button>
                </div>
            </div>

            <!-- Change Display -->
            <div class="mb-6 bg-blue-50 p-4 rounded-lg">
                <div class="flex justify-between">
                    <span class="text-gray-700">Kembalian:</span>
                    <span class="font-semibold text-blue-600">{{ convertRp(addData.paid_amount - props.grandTotal) }}</span>
                </div>
            </div>

            <!-- Tombol Pembayaran -->
            <el-popconfirm title="Apakah data sudah benar?" @confirm="onPaid">
                <template #reference>
                    <button type="button"
                        class="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors">
                        Bayar
                    </button>
                </template>
            </el-popconfirm>
        </el-form>
    </el-dialog>

    <!-- Sukses Pembayaran -->
    <el-dialog v-model="viewDialog" :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false" top="5vh">
        <div class="mx-auto max-w-md w-full pl-11 animate-fade-in-up">
            <!-- Success Icon -->
            <div class="flex justify-center mb-4">
                <div class="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                    <div class="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center">
                        <div v-html="checkLg" class="text-white size-10"></div>
                    </div>
                </div>
            </div>

            <!-- Success Message -->
            <h2 class="text-2xl font-bold text-center text-gray-800 mb-2">Pembayaran Berhasil!</h2>
            <p class="text-center text-gray-600 mb-6">Transaksi telah selesai</p>

            <!-- Receipt Information -->
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
                <div class="flex justify-between mb-3">
                    <span class="text-gray-600">Receipt Number:</span>
                    <span class="font-medium text-gray-800">#{{ viewData.receipt_number }}</span>
                </div>
                <div class="flex justify-between mb-3">
                    <span class="text-gray-600">Tanggal Transaksi:</span>
                    <span class="font-medium text-gray-800">{{ convertDate(viewData.created_at) }}</span>
                </div>
                <div class="flex justify-between mb-3">
                    <span class="text-gray-600">Nominal Transaksi:</span>
                    <span class="font-medium text-gray-800">{{ convertRp(viewData.grand_total) }}</span>
                </div>
                <div class="flex justify-between mb-3">
                    <span class="text-gray-600">Nominal Dibayarkan ({{ viewData.payment_method }}):</span>
                    <span class="font-medium text-gray-800">{{ convertRp(viewData.paid_amount) }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Kembalian:</span>
                    <span class="text-2xl font-bold text-blue-600">{{ convertRp(viewData.change) }}</span>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="grid grid-cols-2 gap-4">
                <button type="button" @click.prevent="onClickComplete('print')"
                    class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center">
                    <div v-html="printer" class="size-6 mr-1"></div>
                    Print
                </button>
                <button type="button" @click.prevent="onClickComplete('completed')"
                    class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200">Selesai</button>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { computed } from 'vue';
import { salePaidApi } from '../../../api/salesApi';
import useAddData from '../../../composables/useAddData';
import useViewData from '../../../composables/useViewData';
import { checkLg, printer } from '../../../helpers/svg';
import { convertDate, convertRp } from '../../../helpers/utils';
import { useRoute } from 'vue-router';

const modelValue = defineModel()
const props = defineProps(['grandTotal', 'receiptNumber'])
const emits = defineEmits(['update:modelValue', 'refresh'])

const route = useRoute()
const qId = computed(() => route.query.qId)

const { viewData, viewDialog, closeView, openViewDialog } = useViewData()

const {
    addData,
    addForm,
    saveAdd,
} = useAddData();

function onPaid() {
    addData.value.queueId = qId.value;
    saveAdd(salePaidApi, (data) => {
        modelValue.value = false;
        openViewDialog(data)
        emits('refresh')
    })
}

function onInputPayment(amount) {
    addData.value.paid_amount = amount
}

function onClickComplete(redirect = 'completed') {
    if (redirect === 'print') {
        window.open('/transaction/print?receipt_number=' + viewData.value?.receipt_number, '_blank');
    } else {
        modelValue.value = false;
        closeView();
    }
}
</script>