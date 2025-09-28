<template>
    <el-dialog v-model="modelValue" title="Transaksi Manual" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" fullscreen class="manual-dialog"
        :z-index="999">
        <div class="p-4">
            <el-form ref="addForm" :model="addData" :rules="manualTransactionRule">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                    <section class="lg:col-span-2 space-y-4">
                        <div class="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 ">
                            <div class="flex gap-2 px-4 pt-5">
                                <div class="relative">
                                    <AutoCompletePasien v-model="keywordPasien" @select="(item) => {
                                        addData.patient_id = item.id
                                        addData.patient_name = item.fullname
                                        addData.record_no = item.record_no
                                    }" />
                                </div>
                                <Poper content="Tambah pasien baru">
                                    <router-link to="/data-pasien">
                                        <el-button type="primary" :icon="PlusIcon"></el-button>
                                    </router-link>
                                </Poper>
                            </div>
                            <div class="px-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                <el-form-item prop="patient_id">
                                    <span class="block text-slate-500">Nama Pasien</span>
                                    <el-input v-model="addData.patient_name" class="w-full rounded-lg border-slate-300 focus:ring-2 focus:ring-sky-500"
                                        placeholder="Nama Pasien" />
                                </el-form-item>
                                <el-form-item>
                                    <span class="block text-slate-500">No Rekam Medis</span>
                                    <el-input v-model="addData.record_no" disabled class="w-full rounded-lg border-slate-300 focus:ring-2 focus:ring-sky-500"
                                        placeholder="No Rekam Medis" />
                                </el-form-item>
                                <el-form-item prop="doctor_id">
                                    <span class="block text-slate-500">Dokter</span>
                                    <el-select v-model="addData.doctor_id" placeholder="Pilih Dokter" @change="(id) => {
                                        const selectedDoctor = doctorList.find((item) => item.id == id)
                                        addData.doctor_name = selectedDoctor.fullname
                                        addData.doctor_id = selectedDoctor.id
                                    }">
                                        <el-option v-for="item in doctorList" :key="item.id" :label="item.fullname" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item prop="transaction_date">
                                    <span class="block mb-1 text-slate-500">Tanggal</span>
                                    <el-date-picker v-model="addData.transaction_date" placeholder="Tanggal" class="w-full" />
                                </el-form-item>
                            </div>
                        </div>

                        <!-- OBAT -->
                        <div class="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200  overflow-hidden">
                            <div class="px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b bg-sky-100">
                                <h2 class="text-sm font-semibold">Obat</h2>
                                <div class="w-full lg:w-1/3">
                                    <AutoCompleteObat v-model="keywordObat" @select="handleSelectObat" />
                                </div>
                            </div>
                            <div div class="divide-y">
                                <!-- jika Tidak ada -->
                                <el-empty v-if="addData.medicines?.length == 0" description="Tidak ada obat" :image-size="50"></el-empty>
                                <!-- item obat -->
                                <template v-for="(item, index) in addData.medicines" :key="index">
                                    <div class="p-3 sm:p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <div class="font-medium">{{ item.name }}</div>
                                            <div class="text-xs text-slate-500" v-if="item.unit_name">{{ item.unit_name }}</div>
                                        </div>
                                        <div class="flex flex-wrap items-center gap-5">
                                            <label class="text-xs">
                                                <span class="block mb-1 text-slate-500">Note</span>
                                                <el-input v-model="item.note" placeholder="Catatan"
                                                    class="w-20 text-right rounded-lg border-slate-300 focus:ring-2 focus:ring-sky-500"></el-input>
                                            </label>
                                            <label class="text-xs max-w-[70px]">
                                                <span class="block mb-1 text-slate-500">Qty</span>
                                                <el-input type="number" v-model="item.quantity"
                                                    class="w-20 text-right rounded-lg border-slate-300 focus:ring-2 focus:ring-sky-500"></el-input>
                                            </label>
                                            <div class="ml-auto sm:ml-0 text-right">
                                                <div class="text-xs text-slate-500">Tarif</div>
                                                <div class="font-semibold">{{ convertRp(item.price) }}</div>
                                            </div>
                                            <div class="ml-auto sm:ml-0 text-right">
                                                <div class="text-xs text-slate-500">Subtotal</div>
                                                <div class="font-semibold">{{ convertRp(item.price * item.quantity) }}</div>
                                            </div>
                                            <el-button @click="addData.medicines.splice(index, 1)" size="small" :icon="Trash2" type="danger"></el-button>
                                        </div>
                                    </div>
                                </template>
                            </div>
                            <div class="px-4 py-3 bg-sky-100 border-t flex justify-end gap-2">
                                <el-button @click="addData.medicines = []" size="small" type="danger" :icon="Trash2" plain>
                                    Hapus Semua
                                </el-button>
                            </div>
                        </div>

                        <!-- LAYANAN -->
                        <div class="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200  overflow-hidden">
                            <div class="px-4 py-3 flex items-center justify-between border-b bg-sky-100">
                                <h2 class="text-sm font-semibold">Layanan</h2>
                                <div class="w-full lg:w-1/3">
                                    <el-select v-model="layananModel" @change="id => handleSelectLayanan(masterLayanan.find(x => x.id === id))" filterable clearable
                                        placeholder="Pilih Layanan">
                                        <el-option disabled v-if="loadingLayanan" class="!cursor-default">
                                            <div class="flex items-center gap-1">
                                                <Loader2 class="size-5 mt-2 text-blue-500 animate-spin mx-auto" />
                                            </div>
                                        </el-option>
                                        <el-option v-for="item in masterLayanan" :key="item.id" :label="`${item.name} - ${convertRp(item.price)}`" :value="item.id" />
                                    </el-select>
                                </div>
                            </div>
                            <ul class="divide-y">
                                <!-- jika Tidak ada -->
                                <el-empty v-if="addData.services?.length == 0" description="Tidak ada layanan" :image-size="50"></el-empty>
                                <template v-for="(item, index) in addData.services" :key="index">
                                    <li class="p-3 sm:p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <div class="font-medium">{{ item.name }}</div>
                                        </div>
                                        <div class="flex flex-wrap items-center gap-5">
                                            <label class="text-xs max-w-[70px]">
                                                <span class="block mb-1 text-slate-500">Qty</span>
                                                <el-input type="number" v-model="item.quantity"
                                                    class="w-20 text-right rounded-lg border-slate-300 focus:ring-2 focus:ring-sky-500"></el-input>
                                            </label>
                                            <div class="ml-auto sm:ml-0 text-right">
                                                <div class="text-xs text-slate-500">Tarif</div>
                                                <div class="font-semibold">{{ convertRp(item.price) }}</div>
                                            </div>
                                            <div class="ml-auto sm:ml-0 text-right">
                                                <div class="text-xs text-slate-500">Subtotal</div>
                                                <div class="font-semibold">{{ convertRp(item.price * item.quantity) }}</div>
                                            </div>
                                            <el-button @click="() => {
                                                addData.services.splice(index, 1);
                                                layananModel = '';
                                            }" size="small" :icon="Trash2" type="danger"></el-button>
                                        </div>
                                    </li>
                                </template>
                            </ul>
                            <div v-if="addData.services?.length > 0" class="px-4 py-3 bg-sky-100 border-t flex justify-end gap-2">
                                <el-popconfirm class="box-item" title="Data layanan akan hilang semua?" placement="top" confirm-button-text="Yes" cancel-button-text="No"
                                    :icon="TriangleAlert" icon-color="ref" @confirm="() => {
                                        addData.services = [];
                                        layananModel = '';
                                    }">
                                    <template #reference>
                                        <el-button size="small" type="danger" :icon="Trash2" plain>
                                            Hapus Semua
                                        </el-button>
                                    </template>
                                </el-popconfirm>
                            </div>
                        </div>

                        <!-- TINDAKAN -->
                        <div class="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200  overflow-hidden">
                            <div class="px-4 py-3 flex items-center justify-between border-b bg-sky-100">
                                <h2 class="text-sm font-semibold">Tindakan</h2>
                                <div class="w-full lg:w-1/3">
                                    <el-select v-model="tindakanModel" @change="id => handleSelectTindakan(masterTindakan.find(x => x.id === id))" filterable clearable
                                        placeholder="Pilih Tindakan">
                                        <el-option disabled v-if="loadingTindakan" class="!cursor-default">
                                            <div class="flex items-center gap-1">
                                                <Loader2 class="size-5 mt-2 text-blue-500 animate-spin mx-auto" />
                                            </div>
                                        </el-option>
                                        <el-option v-for="item in masterTindakan" :key="item.id" :label="`${item.name} - ${convertRp(Number(item.total_fee))}`" :value="item.id" />
                                    </el-select>
                                </div>
                            </div>
                            <ul class="divide-y">
                                <!-- jika Tidak ada -->
                                <el-empty v-if="addData.procedures?.length == 0" description="Tidak ada tindakan" :image-size="50"></el-empty>
                                <template v-for="(item, index) in addData.procedures" :key="index">
                                    <li class="p-3 sm:p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <div class="font-medium">{{ item.name }}</div>
                                        </div>
                                        <div class="flex flex-wrap items-center gap-5">
                                            <label class="text-xs">
                                                <span class="block mb-1 text-slate-500">Note</span>
                                                <el-input v-model="item.note" placeholder="Catatan"
                                                    class="w-20 text-right rounded-lg border-slate-300 focus:ring-2 focus:ring-sky-500"></el-input>
                                            </label>
                                            <label class="text-xs max-w-[70px]">
                                                <span class="block mb-1 text-slate-500">Qty</span>
                                                <el-input type="number" v-model="item.quantity"
                                                    class="w-20 text-right rounded-lg border-slate-300 focus:ring-2 focus:ring-sky-500"></el-input>
                                            </label>
                                            <div class="ml-auto sm:ml-0 text-right">
                                                <div class="text-xs text-slate-500">Tarif</div>
                                                <div class="font-semibold">{{ convertRp(item.price) }}</div>
                                            </div>
                                            <div class="ml-auto sm:ml-0 text-right">
                                                <div class="text-xs text-slate-500">Subtotal</div>
                                                <div class="font-semibold">{{ convertRp(item.price * item.quantity) }}</div>
                                            </div>
                                            <el-button @click="() => {
                                                addData.procedures.splice(index, 1)
                                                tindakanModel = '';
                                            }" size="small" :icon="Trash2" type="danger"></el-button>
                                        </div>
                                    </li>
                                </template>
                            </ul>
                            <div v-if="addData.procedures?.length > 0" class="px-4 py-3 bg-sky-100 border-t flex justify-end gap-2">
                                <el-popconfirm class="box-item" title="Data tindakan akan hilang semua?" placement="top" confirm-button-text="Yes" cancel-button-text="No"
                                    :icon="TriangleAlert" icon-color="ref" @confirm="() => {
                                        addData.procedures = [];
                                        tindakanModel = '';
                                    }">
                                    <template #reference>
                                        <el-button size="small" type="danger" :icon="Trash2" plain>
                                            Hapus Semua
                                        </el-button>
                                    </template>
                                </el-popconfirm>
                            </div>
                        </div>
                    </section>

                    <!-- Pembayaran -->
                    <aside class="lg:col-span-1">
                        <div class="lg:sticky lg:top-6 space-y-4">
                            <div class="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200  overflow-hidden">
                                <div class="px-4 py-3 border-b bg-sky-100 text-sm font-medium">
                                    Ringkasan
                                </div>
                                <div class="p-4 space-y-3 text-sm">
                                    <div class="flex justify-between">
                                        <span>Subtotal Obat</span><span class="font-medium">{{ convertRp(subTotalObat) }}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Subtotal Layanan</span><span class="font-medium">{{ convertRp(subTotalLayanan) }}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Subtotal Tindakan</span><span class="font-medium">{{ convertRp(subTotalTindakan) }}</span>
                                    </div>
                                    <div class="border-t pt-3 flex justify-between items-center font-semibold">
                                        <span>Total</span><span class="text-xl">{{ convertRp(Number(subTotalLayanan) + Number(subTotalObat) + Number(subTotalTindakan)) }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200  overflow-hidden">
                                <div class="px-4 py-3 border-b bg-sky-100 text-sm font-medium">
                                    Pembayaran
                                </div>
                                <div class="p-4 space-y-3 text-sm">
                                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-2">
                                        <template v-for="(item, index) in ['Cash', 'Qris', 'Transfer']" :key="index">
                                            <button @click.prevent="paidForm.payment_method = item" type="button" :class="paidForm.payment_method == item ? 'bg-sky-100' : ''"
                                                class="rounded-xl border px-3 py-2 hover:bg-sky-100">
                                                {{ item }}
                                            </button>
                                        </template>
                                    </div>
                                    <div class="border-t pt-2">
                                        <h1>Nominal:</h1>
                                    </div>
                                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-2">
                                        <button type="button" @click.prevent="onInputPayment(Number(subTotalLayanan) + Number(subTotalObat) + Number(subTotalTindakan))"
                                            class="rounded-xl border px-3 py-2 hover:bg-sky-100">
                                            Uang Pas
                                        </button>
                                        <template v-for="(item, index) in [50000, 100000, 150000, 200000, 250000]" :key="index">
                                            <button type="button" @click.prevent="onInputPayment(item)" :class="paidForm.paid_amount == item ? 'bg-sky-100' : ''"
                                                class="rounded-xl border px-3 py-2 hover:bg-sky-100">
                                                {{ convertRp(item) }}
                                            </button>
                                        </template>
                                    </div>
                                    <div class="grid grid-cols-2 gap-2">
                                        <label class="text-xs">
                                            <span class="block mb-1 text-slate-500">Bayar</span>
                                            <ElCurrencyInput v-model="paidForm.paid_amount" />
                                        </label>
                                        <label class="text-end">
                                            <span class="block mb-1 text-slate-500">Kembalian</span>
                                            <h1 class="font-bold text-lg text-end">{{ convertRp(paidForm.paid_amount - Number(subTotalLayanan) - Number(subTotalObat) -
                                                Number(subTotalTindakan))
                                            }}
                                            </h1>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </el-form>
        </div>

        <template #footer>
            <div class="dialog-footer flex justify-end">
                <el-popconfirm class="box-item" title="Data tidak akan tersimpan dan akan hilang" placement="top" confirm-button-text="Yes" cancel-button-text="No"
                    :icon="FileWarning" icon-color="ref" @confirm="modelValue = false">
                    <template #reference>
                        <el-button type="danger" plain>Cancel</el-button>
                    </template>
                </el-popconfirm>
                <el-button type="info" @click="onSaveDraft">Simpan Draft</el-button>
                <el-button type="primary" :icon="ShieldCheck" @click="onSaveAndPaid">Bayar</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch, computed, reactive } from 'vue'
import { FileWarning, Loader2, PlusIcon, ShieldCheck, Trash2, TriangleAlert } from 'lucide-vue-next'
import useAddData from '../../../composables/useAddData'
import AutoCompletePasien from '../../../components/Remote/AutoCompletePasien.vue'
import Poper from '../../../components/Poper.vue'
import { convertRp, doctorListHelper, loadingScreen, messageInfo } from '../../../helpers/utils'
import useGetData from '../../../composables/useGetData'
import { APISelectTipeLayanan } from '../../../api/apiHelper'
import { apiMasterTindakan } from '../../../api/apiMedicine'
import AutoCompleteObat from '../../../components/Remote/AutoCompleteObat.vue'
import { apiPaidSales, apiSalesManualTransaction } from '../../../api/salesApi'
import { useRouter } from 'vue-router'

const modelValue = defineModel()

const router = useRouter();

const tindakanModel = ref('')
const layananModel = ref('')
const keywordPasien = ref('')
const keywordObat = ref('')
const doctorList = ref([]);

const [masterLayanan, getMasterLayanan, loadingLayanan] = useGetData({ defaultLoading: true });
const [masterTindakan, getMasterTindakan, loadingTindakan] = useGetData({ defaultLoading: true });
const {
    addData,
    addForm,
    addDialog,
    saveAdd,
    cancelAdd,
    requiredLabelLength,
    openDialog,
    isLoading,
} = useAddData()
const { 1: fetchApi } = useGetData();

const subTotalObat = computed(() =>
    addData.value.medicines.reduce((acc, item) => acc + (Number(item.price) * item.quantity || 0), 0)
)
const subTotalLayanan = computed(() =>
    addData.value.services.reduce((acc, item) => acc + (Number(item.price) * item.quantity || 0), 0)
)
const subTotalTindakan = computed(() =>
    addData.value.procedures.reduce((acc, item) => acc + (Number(item.price) * item.quantity || 0), 0)
)

const paidForm = reactive({
    paid_amount: 0,
    payment_method: 'Cash',
    note: '',
})

async function firstLoad() {
    addData.value.medicines = [];
    addData.value.services = [];
    addData.value.procedures = [];
    addData.value.paid_amount = 0;
    addData.value.transaction_date = new Date().toISOString();
    if (doctorList.value.length === 0) {
        const doctors = await doctorListHelper();
        doctorList.value = doctors || [];
        const doctorOnDuty = doctors.find((item) => item.is_on_duty === true);
        addData.value.doctor_id = doctorOnDuty?.id;
        addData.value.doctor_name = doctorOnDuty?.fullname;
    }
    getMasterTindakan(apiMasterTindakan, true, true);
    getMasterLayanan(APISelectTipeLayanan, true, true);
}

function handleSelectTindakan(data) {
    // kalo udah ada id yang sama, tambah quantity
    const selected = addData.value.procedures.find(item => item.tindakan_id === data.id)
    if (selected) {
        selected.quantity += 1
    } else {
        addData.value.procedures.push({
            tindakan_id: data.id,
            name: data.name,
            price: data.total_fee,
            sub_total: data.total_fee * 1,
            quantity: 1,
        })
    }
}

function handleSelectLayanan(data) {
    // kalo udah ada id yang sama, tambah quantity
    const selected = addData.value.services.find(item => item.service_type_id === data.id)
    if (selected) {
        selected.quantity += 1
    } else {
        addData.value.services.push({
            service_type_id: data.id,
            name: data.name,
            price: data.price,
            sub_total: data.price * 1,
            quantity: 1,
        })
    }
}

function handleSelectObat(data) {
    // kalo udah ada id yang sama, tambah quantity
    const selected = addData.value.medicines.find(item => item.product_id === data.product_id)
    if (selected) {
        selected.quantity += 1
    } else {
        addData.value.medicines.push({
            product_id: data.product_id,
            product_unit_id: data.product_unit_id,
            name: data.name,
            sku: data.sku,
            unit_name: data.unit_name,
            price: data.new_price || data.sell_price,
            sub_total: data.new_price || data.sell_price * 1,
            quantity: 1,
        })
    }
}

function onSaveDraft() {
    saveAdd(apiSalesManualTransaction, (data) => {
        if (data) {
            router.push({ name: 'sales-detail', query: { sId: data.sale_id } });
        }
    });
}

function onSaveAndPaid() {
    // jika total bayar lebih kecil
    const grandTotal = subTotalObat.value + subTotalLayanan.value + subTotalTindakan.value
    if (paidForm.paid_amount < grandTotal) {
        return messageInfo('Nominal pembayaran tidak boleh lebih kecil dari total transaksi', 'warning');
    }
    saveAdd(apiSalesManualTransaction, (data) => {
        if (data) {
            const loadSc = loadingScreen();
            fetchApi(() => apiPaidSales(data.sale_id, paidForm), false, true, (r) => {
                loadSc.close();
                if (r) {
                    messageInfo('Transaksi berhasil dibayar', 'success');
                    router.push({ name: 'sales-detail', query: { sId: data.sale_id } });
                }
            })
        }
    });
}

function onInputPayment(amount) {
    paidForm.paid_amount = amount
}

function onPaid() {
}

function setVHVar() {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
}
onMounted(() => {
    setVHVar()
    window.addEventListener('resize', setVHVar)
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', setVHVar)
})

// ketika modal dibuka, load func firstload
watch(modelValue, () => {
    if (modelValue.value) {
        firstLoad();
    }
})
</script>

<style>
/* 1) Jadikan dialog full-viewport yang aman di mobile:
      - pakai dvh jika ada
      - fallback ke custom --vh (dari JS) atau 100vh */
.manual-dialog {
    display: flex;
    flex-direction: column;
    /* tinggi dialog wrapper */
    height: 100dvh;
    /* modern browsers */
    height: calc(var(--vh, 1vh) * 100);
    /* fallback */
}

.manual-dialog .el-dialog__body {
    /* isi mengisi sisa ruang dan bisa scroll */
    flex: 1;
    overflow: auto;
    /* untuk iOS safe area jika perlu */
    padding-bottom: max(16px, env(safe-area-inset-bottom));
}

.manual-dialog .el-dialog__footer {
    position: sticky;
    bottom: 0;
    background: #fff;
    border-top: 1px solid var(--el-border-color);
    z-index: 1;
    padding: 12px 16px;
}

/* Bila browser belum dukung dvh, pakai svh sebagai alternatif */
@supports (height: 100svh) {
    .manual-dialog {
        height: 100svh;
    }
}
</style>
