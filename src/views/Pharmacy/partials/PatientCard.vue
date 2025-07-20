<template>
    <div class="w-full">
        <div class="grid gap-6 md:grid-cols-2">
            <!-- Kartu Data Pasien -->
            <div class="bg-white rounded-lg shadow-md p-4">
                <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                    <UserCircleIcon class="h-5 w-5 text-blue-500" />
                    Data Pasien
                </h2>
                <div class="space-y-3">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <p class="text-sm text-gray-500 font-bold">No. Rekam Medis</p>
                            <div class="flex items-center gap-x-1">
                                <p class="font-medium">{{ data?.patient?.record_no }}</p>
                                <el-tooltip class="box-item" effect="dark" content="Copy" placement="top">
                                    <button type="button" @click="copyToClipboard(data?.patient?.record_no)">
                                        <ClipboardDocumentIcon class="h-4 w-4 text-blue-500" />
                                    </button>
                                </el-tooltip>
                            </div>
                        </div>
                        <div class="space-y-1">
                            <p class="text-sm text-gray-500 font-bold">No. HP</p>
                            <div class="flex items-center gap-x-1">
                                <p class="font-medium">{{ data?.patient?.phone || '-' }}</p>
                                <el-tooltip class="box-item" effect="dark" content="Copy" placement="top">
                                    <button type="button" @click="copyToClipboard(data?.patient?.phone)">
                                        <ClipboardDocumentIcon class="h-4 w-4 text-blue-500" />
                                    </button>
                                </el-tooltip>
                            </div>
                        </div>
                    </div>
                    <div class="space-y-1">
                        <p class="text-sm text-gray-500 font-bold">Nama Pasien</p>
                        <div class="flex items-center gap-x-1">
                            <p class="font-medium">{{ data?.patient?.fullname || '-' }}</p>
                            <el-tooltip class="box-item" effect="dark" content="Copy" placement="top">
                                <button type="button" @click="copyToClipboard(data?.patient?.fullname)">
                                    <ClipboardDocumentIcon class="h-4 w-4 text-blue-500" />
                                </button>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="space-y-1">
                        <p class="text-sm text-gray-500 font-bold">Nama Keluarga</p>
                        <p class="font-medium">{{ data?.patient?.nama_keluarga || '-' }}</p>
                    </div>
                    <div class="space-y-1">
                        <p class="text-sm text-gray-500 font-bold">Dokter</p>
                        <p class="font-medium">{{ data?.doctor?.fullname || '-' }}</p>
                    </div>
                </div>
            </div>

            <!-- Kartu Tanda Vital -->
            <div class="bg-white rounded-lg shadow-md p-4">
                <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                    <ChartBarIcon class="h-5 w-5 text-green-500" />
                    Pemeriksaan Fisik
                </h2>
                <div class="grid grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <div class="space-y-1">
                            <div class="flex items-center gap-2">
                                <HeartIcon class="h-4 w-4 text-red-500" />
                                <p class="text-sm text-gray-500 font-bold">Tekanan Darah</p>
                            </div>
                            <p class="font-medium">{{ data?.history?.blood_pressure || '-' }} mmHg</p>
                        </div>
                        <div class="space-y-1">
                            <div class="flex items-center gap-2">
                                <ScaleIcon class="h-4 w-4 text-purple-500" />
                                <p class="text-sm text-gray-500 font-bold">Berat Badan</p>
                            </div>
                            <p class="font-medium">{{ data?.history?.weight || '-' }} kg</p>
                        </div>
                    </div>
                    <div class="space-y-4">
                        <div class="space-y-1">
                            <div class="flex items-center gap-2">
                                <BeakerIcon class="h-4 w-4 text-orange-500" />
                                <p class="text-sm text-gray-500 font-bold">Suhu Badan</p>
                            </div>
                            <p class="font-medium">{{ data?.history?.temperature || '-' }} °C</p>
                        </div>
                        <div class="space-y-1">
                            <div class="flex items-center gap-2">
                                <ArrowTrendingUpIcon class="h-4 w-4 text-blue-500" />
                                <p class="text-sm text-gray-500 font-bold">Tinggi Badan</p>
                            </div>
                            <p class="font-medium">{{ data?.history?.height || '-' }} cm</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Daftar Obat -->
            <div class="bg-white rounded-lg shadow-md p-4 md:col-span-2">
                <div class="flex items-center gap-x-2 mb-4">
                    <h2 class="text-xl font-semibold flex items-center gap-2">
                        <div v-html="capsulePill" class="size-5 text-indigo-400"></div>
                        Daftar Obat
                    </h2>
                    <template v-if="!hideAction">
                        <el-tooltip class="box-item" effect="dark" content="Refresh" placement="top">
                            <ArrowPathIcon class="size-5 text-blue-500 cursor-pointer" @click="fetchMedicine" />
                        </el-tooltip>
                    </template>
                </div>
                <div class="space-y-2">
                    <template v-if="!loadingMedicine">
                        <template v-for="(item, index) in medicineList" :key="index">
                            <!-- NEW -->
                            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-3 relative overflow-hidden">
                                <template v-if="item.status == 'rejected'">
                                    <div class="absolute w-full h-full top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-gray-300/80 z-10">
                                        <div class="bg-red-400 rounded-full py-2 px-6">
                                            <p class="text-sm text-white">{{ item.status_name }}</p>
                                        </div>
                                    </div>
                                </template>

                                <div class="flex items-start justify-between h-full">
                                    <div class="flex-1 space-y-2">
                                        <div class="flex items-center gap-2">
                                            <h3 class="font-semibold text-gray-800 text-sm">{{ item.is_compound ? item.compound_name : item.product.name }}</h3>
                                            <span v-if="item.is_compound" class="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">PUYER</span>
                                        </div>
                                        <template v-if="!item.is_compound">
                                            <div class="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                                                <Poper content="Kode Obat">
                                                    <div class="flex items-center gap-0.5">
                                                        <ScanBarcode class="shrink-0 h-4 w-4 text-gray-400" />
                                                        <span>SKU: <strong>{{ item.product.sku || '-' }}</strong></span>
                                                    </div>
                                                </Poper>
                                                <Poper content="Satuan obat">
                                                    <div class="flex items-center gap-0.5">
                                                        <Package class="shrink-0 h-4 w-4 text-gray-400" />
                                                        <span>Satuan: <strong>{{ item?.product_unit?.name || '-' }}</strong></span>
                                                    </div>
                                                </Poper>
                                                <Poper content="Stok">
                                                    <div class="flex items-center gap-0.5">
                                                        <Warehouse class="shrink-0 h-4 w-4 text-gray-400" />
                                                        <span>Stok: <strong>{{ item.product.base_stock || 0 }}</strong></span>
                                                    </div>
                                                </Poper>
                                            </div>
                                        </template>
                                        <div class="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                                            <Poper content="Jumlah obat">
                                                <div class="flex items-center gap-0.5">
                                                    <Boxes class="shrink-0 h-4 w-4 text-gray-400" />
                                                    <span>Qty: <strong>{{ item.qty }}</strong></span>
                                                </div>
                                            </Poper>
                                            <Poper content="Dosis">
                                                <div class="flex items-center gap-0.5">
                                                    <Clock class="shrink-0 h-4 w-4 text-gray-400" />
                                                    <span>Dosis: <strong>{{ item.dosage }}</strong></span>
                                                </div>
                                            </Poper>
                                            <Poper content="Instruksi pemakaian">
                                                <div class="flex items-center gap-0.5">
                                                    <GlassWater class="shrink-0 h-4 w-4 text-gray-400" />
                                                    <span>{{ item.usage_instruction || '-' }}</span>
                                                </div>
                                            </Poper>
                                            <Poper content="Catatan">
                                                <div class="flex items-center gap-0.5">
                                                    <Notebook class="shrink-0 h-4 w-4 text-gray-400" />
                                                    <span>{{ item.notes || '-' }}</span>
                                                </div>
                                            </Poper>
                                        </div>
                                    </div>
                                    <!-- layout kolom kanan -->
                                    <div class="flex flex-col gap-3 justify-between items-end h-full text-right">
                                        <!-- Harga di atas -->
                                        <div class="text-xs">
                                            <div class="flex items-center justify-end gap-1">
                                                <p>Harga: <span v-if="!item.IS_CHANGE_PRICE" @click="item.IS_CHANGE_PRICE = !item.IS_CHANGE_PRICE"
                                                        class="font-semibold text-sm text-green-500">{{
                                                            convertRp(item.total_price) }}</span></p>
                                                <template v-if="item.IS_CHANGE_PRICE">
                                                    <div class="max-w-28">
                                                        <ElCurrencyInput ref="currencyInputRefs[index]" @keyup.enter="onChangeMedicinePrice(item)" v-model="item.total_price" />
                                                    </div>
                                                    <Poper content="Simpan harga obat baru">
                                                        <Check @click="onChangeMedicinePrice(item)" class="text-xs size-5 cursor-pointer" />
                                                    </Poper>
                                                </template>
                                                <template v-else>
                                                    <Poper content="Edit harga obat">
                                                        <PencilLine class="text-xs size-4 cursor-pointer" @click="item.IS_CHANGE_PRICE = !item.IS_CHANGE_PRICE" />
                                                    </Poper>
                                                </template>
                                            </div>
                                            <template v-if="item.additional_price">
                                                <p class="text-xs text-nowrap font-normal border-b text-gray-500">Biaya Tambahan: <span
                                                        class="font-semibold text-sm text-gray-500">{{
                                                            convertRp(item.additional_price) }}</span></p>
                                                <p class="text-xs text-nowrap font-normal text-gray-500">Total Harga: <span class="font-semibold text-sm text-green-500">{{
                                                    convertRp(Number(item.additional_price) + Number(item.total_price)) }}</span></p>
                                            </template>
                                        </div>
                                        <div class="flex">
                                            <el-button type="primary" size="small" :icon="Info" @click="onDetailMedicine(item)">Detail</el-button>
                                            <template v-if="!hideAction && item.status !== 'rejected'">
                                                <el-button type="danger" size="small" :icon="Close" @click="onCancelMedicine(item)">Cancel</el-button>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                                <template v-if="item.is_compound">
                                    <div class="flex flex-wrap items-center text-xs text-gray-600">
                                        <h1 class="font-medium text-gray-800 text-sm mb-1">Daftar Obat Racikan:</h1>
                                        <el-table :data="item.compound_meds" stripe border style="width: 100%" size="small">
                                            <el-table-column prop="product.name" min-width="150" label="Obat" />
                                            <el-table-column prop="product.sku" label="SKU" />
                                            <el-table-column prop="amount" label="Jumlah" align="center" min-width="100">
                                                <template #default="{ row }">
                                                    <span class="font-bold">{{ row.amount }} {{ row?.product_unit?.unit.name ? row.product_unit.unit.name : '' }}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="notes" label="Catatan">
                                                <template #default="{ row }">
                                                    <span>{{ row.notes ? row.notes : '-' }}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="product.sell_price" label="Harga Satuan">
                                                <template #default="{ row }">
                                                    {{ convertRp(row?.product?.sell_price) }}
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="product.base_stock" label="Stok" align="center">
                                                <template #default="{ row }">
                                                    <span>{{ row?.product?.base_stock }}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="price" label="Total Harga" fixed="right" min-width="100" align="right">
                                                <template #default="{ row }">
                                                    <span class="font-semibold">{{ convertRp(row.price) }}</span>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </div>
                                </template>
                            </div>
                        </template>
                    </template>

                    <!-- Loading Obat -->
                    <div class="flex items-center justify-center w-full col-span-2" v-if="loadingMedicine">
                        <h1 class="font-semibold text-sm text-center">Loading...</h1>
                    </div>

                    <!-- Jika tidak ada obat dan berhenti loading -->
                    <div class="flex items-center justify-center w-full col-span-2" v-if="!loadingMedicine && medicineList.length === 0">
                        <h1 class="font-semibold text-sm text-center">Tidak ada obat</h1>
                    </div>
                </div>
            </div>

            <!-- Daftar Layanan -->
            <div class="bg-white rounded-lg shadow-md p-4 md:col-span-2">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-x-2">
                        <h2 class="text-xl font-semibold flex items-center gap-2">
                            <Stethoscope class="size-5 text-indigo-400" />
                            Tipe Layanan
                        </h2>
                        <template v-if="!hideAction">
                            <el-tooltip class="box-item" effect="dark" content="Refresh" placement="top">
                                <ArrowPathIcon class="size-5 text-blue-500 cursor-pointer" @click="fetchService" />
                            </el-tooltip>
                        </template>
                    </div>
                    <el-button v-if="!hideAction" type="primary" size="small" :icon="Plus" @click="onAddManualService">Tambah Manual</el-button>
                </div>
                <div class="space-y-2">
                    <div class="flex items-center justify-center w-full col-span-2" v-if="serviceList.length == 0 && !isLoadingGetService">
                        <h1 class="font-semibold text-sm text-center">Tidak ada layanan</h1>
                    </div>

                    <template v-if="!isLoadingGetService">
                        <template v-for="(item, index) in serviceList" :key="index">
                            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                                <div class="flex items-start justify-between">
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2 mb-1">
                                            <Info class="size-5 text-indigo-400" />
                                            <h3 class="font-semibold text-gray-800 text-sm">{{ item.service_type_name }}</h3>
                                        </div>
                                        <div class="flex items-center gap-4 text-xs text-gray-600">
                                            <div class="flex items-center gap-0.5">
                                                <Boxes class="shrink-0 h-4 w-4 text-gray-400" />
                                                <span>Qty: <strong>{{ item.quantity }}</strong></span>
                                            </div>
                                            <div class="flex items-center gap-0.5">
                                                <Notebook class="shrink-0 h-4 w-4 text-gray-400" />
                                                <span>{{ item.notes || '-' }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="text-right flex flex-col gap-3">
                                        <div>
                                            <div class="text-xs text-gray-500">@{{ convertRp(item.service_type_price) }}</div>
                                            <div class="font-bold text-green-600">{{ convertRp(item.total_price) }}</div>
                                        </div>
                                        <template v-if="!hideAction">
                                            <el-popconfirm title="Apakah yakin ingin menghapus layanan ini?" @confirm="onDeleteService(item.id)">
                                                <template #reference>
                                                    <el-button type="danger" size="small" :icon="Trash2">Hapus</el-button>
                                                </template>
                                            </el-popconfirm>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </template>

                    <!-- Loading layanan -->
                    <div class="flex items-center justify-center w-full" v-if="isLoadingGetService">
                        <h1 class="font-semibold text-sm text-center">Loading...</h1>
                    </div>
                </div>
            </div>

            <!-- Daftar Tindakan -->
            <div class="bg-white rounded-lg shadow-md p-4 md:col-span-2">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-x-2">
                        <h2 class="text-xl font-semibold flex items-center gap-2">
                            <div v-html="activity" class="size-5 text-indigo-400"></div>
                            Daftar Tindakan
                        </h2>
                        <template v-if="!hideAction">
                            <el-tooltip class="box-item" effect="dark" content="Refresh" placement="top">
                                <ArrowPathIcon class="size-5 text-blue-500 cursor-pointer" @click="fetchTindakan" />
                            </el-tooltip>
                        </template>
                    </div>
                    <el-button v-if="!hideAction" type="primary" size="small" :icon="Plus" @click="onAddManualTindakan">Tambah Manual</el-button>
                </div>
                <div class="space-y-2">
                    <!-- Jika tindakan kosong -->
                    <div class="flex items-center justify-center w-full col-span-2" v-if="tindakanList.length == 0 && !loadingTindakan">
                        <h1 class="font-semibold text-sm text-center">Tidak ada tindakan</h1>
                    </div>

                    <template v-if="!loadingTindakan">
                        <template v-for="(item, index) in tindakanList" :key="index">
                            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                                <div class="flex items-start justify-between">
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2 mb-1">
                                            <Info class="size-5 text-indigo-400" />
                                            <h3 class="font-semibold text-gray-800 text-sm">{{ item.procedure_name }}</h3>
                                        </div>
                                        <div class="flex items-center gap-4 text-xs text-gray-600">
                                            <div class="flex items-center gap-0.5">
                                                <Boxes class="shrink-0 h-4 w-4 text-gray-400" />
                                                <span>Qty: <strong>{{ item.quantity }}</strong></span>
                                            </div>
                                            <div class="flex items-center gap-0.5">
                                                <Notebook class="shrink-0 h-4 w-4 text-gray-400" />
                                                <span>{{ item.notes || '-' }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="text-right flex flex-col gap-3">
                                        <div>
                                            <div class="text-xs text-gray-500">@{{ convertRp(item.price) }}</div>
                                            <div class="text-sm font-bold text-green-600">{{ convertRp(item.price * item.quantity) }}</div>
                                        </div>
                                        <template v-if="!hideAction">
                                            <el-popconfirm v-if="profile?.role == item.source" title="Apakah yakin ingin menghapus tindakan ini?"
                                                @confirm="onDeleteTindakan(item.id)">
                                                <template #reference>
                                                    <el-button type="danger" size="small">Hapus</el-button>
                                                </template>
                                            </el-popconfirm>
                                        </template>
                                    </div>
                                </div>
                            </div>
                            <div class="p-3 bg-white rounded-xl shadow-sm border" v-if="false">
                                <div class="flex items-start justify-between">
                                    <div>
                                        <h3 class="font-semibold text-gray-800">
                                            {{ item.procedure_name }}
                                        </h3>
                                        <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
                                        <p class="text-sm text-gray-500">Catatan: {{ item.notes || '-' }}</p>
                                    </div>
                                    <div class="text-right">
                                        <div>
                                            <p class="text-sm text-gray-400">Biaya</p>
                                            <p class="font-bold text-green-600">{{ convertRp(item.price * item.quantity) }}</p>
                                        </div>
                                        <template v-if="!hideAction">
                                            <el-popconfirm v-if="profile?.role == item.source" title="Apakah yakin ingin menghapus tindakan ini?"
                                                @confirm="onDeleteTindakan(item.id)">
                                                <template #reference>
                                                    <el-button type="danger" size="small">Hapus</el-button>
                                                </template>
                                            </el-popconfirm>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </template>

                    <!-- Loading tindakan -->
                    <div class="flex items-center justify-center w-full" v-if="loadingTindakan">
                        <h1 class="font-semibold text-sm text-center">Loading...</h1>
                    </div>
                </div>
            </div>

            <!-- Kartu Detail Medis -->
            <div class="bg-white rounded-lg shadow-md p-4 md:col-span-2">
                <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                    <UserIcon class="h-5 w-5 text-indigo-500" />
                    Detail Medis
                </h2>
                <div class="grid gap-6 md:grid-cols-2">
                    <div class="space-y-1">
                        <div class="flex items-center gap-2">
                            <ClipboardDocumentIcon class="h-4 w-4 text-gray-500" />
                            <p class="text-sm text-gray-500 font-bold">Pemeriksaan</p>
                        </div>
                        <p class="whitespace-pre-line">{{ data?.history?.pemeriksaan || '-' }}</p>
                    </div>
                    <div class="space-y-1">
                        <div class="flex items-center gap-2">
                            <DocumentTextIcon class="h-4 w-4 text-red-500" />
                            <p class="text-sm text-gray-500 font-bold">Diagnosis</p>
                        </div>
                        <p class="whitespace-pre-line">{{ data?.history?.diagnosa || '-' }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Cancel Dialog -->
    <el-dialog v-model="cancelDialog" title="Cancel Obat" :width="dialogWidth()" top="5vh">
        <div class="space-y-4">
            <p>Apakah anda yakin ingin membatalkan obat ini?</p>
            <el-form ref="cancelForm" :model="cancelData" label-position="top">
                <el-form-item label="Catatan" prop="note" :rules="[{ required: true }]">
                    <el-input type="textarea" v-model="cancelData.note" placeholder="Masukan Catatan"></el-input>
                </el-form-item>
            </el-form>
            <div class="flex items-center  justify-end gap-3">
                <button type="button" class="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-opacity-80 transition-colors" @click="onSubmitCancel">Submit</button>
            </div>
        </div>
    </el-dialog>

    <!-- Detail Obat -->
    <el-dialog v-model="detailObatDialog" :title="detailObat.is_compound ? 'Obat Racikan' : 'Obat Tunggal'" :width="dialogWidth({ onDesktop: '40%' })" top="5vh">
        <div class="p-3 space-y-4">
            <!-- Informasi Umum -->
            <div class="space-y-2" v-if="false">
                <div v-if="detailObat.is_compound">
                    <p class="text-sm text-gray-500">Nama Racikan</p>
                    <p class="font-semibold text-gray-700">{{ detailObat.compound_name }}</p>
                </div>
                <template v-else>
                    <div>
                        <p class="text-sm text-gray-500">Nama Obat</p>
                        <p class="font-semibold text-gray-700">{{ detailObat.product?.name ?? '-' }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Stok Dasar</p>
                        <p class="font-medium text-gray-700">{{ detailObat.product?.base_stock ?? 0 }}</p>
                    </div>
                </template>

                <div>
                    <p class="text-sm text-gray-500">Dosis</p>
                    <p class="text-gray-700 font-medium">{{ detailObat.dosage }}</p>
                </div>

                <div>
                    <p class="text-sm text-gray-500">Jumlah</p>
                    <p class="text-gray-700 font-medium">{{ detailObat.qty }}</p>
                </div>

                <div>
                    <p class="text-sm text-gray-500">Aturan Pakai</p>
                    <p class="text-gray-700 font-medium">{{ detailObat.usage_instruction || '-' }}</p>
                </div>

                <div>
                    <p class="text-sm text-gray-500">Keterangan</p>
                    <p class="text-gray-700 font-medium">{{ detailObat.notes || '-' }}</p>
                </div>

                <div v-if="detailObat.is_compound && detailObat.mix_instruction">
                    <p class="text-sm text-gray-500">Instruksi Pencampuran</p>
                    <p class="text-gray-700 font-medium">{{ detailObat.mix_instruction || '-' }}</p>
                </div>
            </div>

            <div class="space-y-4 text-sm text-gray-700">
                <InfoRow icon="pill" label="Nama Obat" :value="detailObat.product?.name ?? '-'" />
                <InfoRow icon="database" label="Stok Dasar" :value="detailObat.product?.base_stock ?? 0" />
                <InfoRow icon="circle-dot" label="Dosis" :value="detailObat.dosage" />
                <InfoRow icon="package" label="Jumlah" :value="detailObat.qty" />
                <InfoRow icon="glass-water" label="Aturan Pakai" :value="detailObat.usage_instruction || '-'" />
                <InfoRow icon="sticky-note" label="Keterangan" :value="detailObat.notes || '-'" />
            </div>

            <!-- Daftar Komposisi Obat Racikan -->
            <div v-if="detailObat.is_compound">
                <p class="text-sm font-semibold text-gray-800 mb-2">Komposisi Racikan:</p>
                <ul class="space-y-2">
                    <li v-for="(med, index) in detailObat.compound_meds" :key="med.id" class="p-3 bg-gray-50 rounded-lg border">
                        <div class="flex justify-between">
                            <p class="font-medium text-gray-700">
                                {{ med.product?.name ?? 'Nama tidak ditemukan' }}
                            </p>
                            <p class="text-gray-600">
                                {{ med.amount }} {{ med.unit.name }}
                            </p>
                        </div>
                        <p class="text-sm text-gray-400">SKU: {{ med.product?.sku ?? '-' }}</p>
                        <p class="text-sm text-gray-400">Harga: {{ convertRp(med.product?.sell_price) }}</p>
                    </li>
                </ul>
            </div>
        </div>
    </el-dialog>

    <!-- Tambah Tindakan Manual -->
    <el-dialog v-model="addDialog" title="Tindakan Manual" :width="dialogWidth()" top="5vh">
        <div class="space-y-4">
            <el-form ref="addForm" :model="addData" label-position="top">
                <el-form-item label="Pilih Tindakan" prop="procedure_id">
                    <el-select @change="handleSelectTindakan" filterable clearable v-model="addData.procedure_id" placeholder="Pilih Tindakan">
                        <el-option v-for="item in masterTindakan" :key="item.id" :label="`${item.name} - Rp${Number(item.total_fee).toLocaleString('id-ID')}`" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="Nama Tindakan" prop="procedure_name" :rules="[{ required: true }]">
                    <el-input v-model="addData.procedure_name" placeholder="Masukan Nama Tindakan" />
                </el-form-item>
                <el-form-item label="Biaya" prop="price" :rules="[{ required: true }]">
                    <el-currency-input v-model="addData.price" placeholder="Masukan Biaya Tindakan" />
                </el-form-item>
                <el-form-item label="Jumlah" prop="quantity" :rules="[{ required: true }]">
                    <el-input v-model="addData.quantity" placeholder="Masukan Jumlah" />
                </el-form-item>
                <el-form-item label="Catatan" prop="notes">
                    <el-input type="textarea" v-model="addData.notes" placeholder="Masukan Catatan"></el-input>
                </el-form-item>
            </el-form>
            <div class="flex items-center  justify-end gap-3">
                <button type="button" class="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-opacity-80 transition-colors" @click="onSubmitManualTindakan">Submit</button>
            </div>
        </div>
    </el-dialog>

    <!-- Tambah Layanan Manual -->
    <el-dialog v-model="addDialogService" title="Layanan Manual" :width="dialogWidth()" top="5vh">
        <div class="space-y-4">
            <el-form ref="addFormService" :model="addDataService" label-position="top">
                <el-form-item label="Pilih Layanan" prop="service_type_id">
                    <el-select filterable clearable v-model="addDataService.service_type_id" placeholder="Pilih Layanan">
                        <el-option v-for="item in masterLayanan" :key="item.id" :label="`${item.name} - ${convertRp(item.price)}`" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="Jumlah" prop="quantity" :rules="[{ required: true }]">
                    <el-input v-model="addDataService.quantity" placeholder="Masukan Jumlah" />
                </el-form-item>
                <el-form-item label="Catatan" prop="notes">
                    <el-input type="textarea" v-model="addDataService.notes" placeholder="Masukan Catatan"></el-input>
                </el-form-item>
            </el-form>
            <div class="flex items-center  justify-end gap-3">
                <button type="button" class="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-opacity-80 transition-colors" @click="onSubmitManualLayanan">Submit</button>
            </div>
        </div>
    </el-dialog>

    <!-- Daftar Obat Racikan -->
    <el-dialog v-model="viewDialog" :width="dialogWidth()" top="5vh">
        <template #header>
            <h1>Detail Obat Racikan</h1>
        </template>
        <section>
            <el-table :data="viewData" stripe border style="width: 100%">
                <el-table-column prop="product.name" label="Nama Obat" min-width="150" />
                <el-table-column prop="product.base_stock" label="Stok" />
                <el-table-column prop="product.sell_price" label="Harga Satuan" align="right" min-width="130">
                    <template #default="scope">
                        {{ convertRp(scope.row.product.sell_price) }}
                    </template>
                </el-table-column>
                <el-table-column prop="amount" label="Jumlah Kebutuhan" min-width="200" />
                <el-table-column prop="product_unit.unit.name" label="Satuan" />
                <el-table-column prop="price" fixed="right" label="Total Harga" align="right" min-width="130">
                    <template #default="scope">
                        {{ convertRp(scope.row.price) }}
                    </template>
                </el-table-column>
                <el-table-column prop="notes" label="Catatan" min-width="200" />
            </el-table>
        </section>
    </el-dialog>
</template>

<script setup>
import {
    UserCircleIcon,
    ChartBarIcon,
    HeartIcon,
    BeakerIcon,
    ScaleIcon,
    ArrowTrendingUpIcon,
    UserIcon,
    ClipboardDocumentIcon,
    DocumentTextIcon,
    ArrowPathIcon,
} from '@heroicons/vue/24/outline'
import { convertRp, copyToClipboard, dialogWidth } from '../../../helpers/utils';
import { activity, capsule, capsulePill } from '../../../helpers/svg';
import { Close } from '@element-plus/icons-vue';
import useEditData from '../../../composables/useEditData';
import { apiDeleteService, apiDeleteTindakan, apiListServiceByQueue, apiMasterTindakan, apiMedicineChangePrice, apiPostService, apiPostTindakan, apiRejectMedicine } from '../../../api/apiMedicine';
import useViewData from '../../../composables/useViewData';
import useAddData from '../../../composables/useAddData';
import useGetData from '../../../composables/useGetData';
import { useAppStore } from '../../../store/appStore';
import { watch, computed, ref, nextTick } from 'vue';
import useDeleteData from '../../../composables/useDeleteData';
import { Boxes, Clock, GlassWater, Info, Notebook, Package, PencilLine, Check, Plus, ScanBarcode, Stethoscope, Trash2, User, Warehouse } from 'lucide-vue-next';
import { APISelectTipeLayanan } from '../../../api/apiHelper';
import Poper from '../../../components/Poper.vue';
import InfoRow from '../../../components/InfoRow.vue';
import ElCurrencyInput from '../../../components/ElCurrencyInput.vue';

const appStore = useAppStore();
const profile = computed(() => appStore.profile);
const currencyInputRefs = ref([]);

const props = defineProps({
    data: {
        type: Object,
        required: true
    },
    medicineList: {
        type: Array,
        required: true
    },
    loadingMedicine: {
        type: Boolean,
        required: true
    },
    tindakanList: {
        type: Array,
        required: true
    },
    loadingTindakan: {
        type: Boolean,
        required: true
    },
    hideAction: {
        type: Boolean,
        default: false
    }
})

watch(
    () => props.medicineList.map(i => i.IS_CHANGE_PRICE),
    async (newValues, oldValues) => {
        newValues.forEach(async (v, index) => {
            if (v && !oldValues[index]) {
                await nextTick();
                currencyInputRefs.value[index]?.focus?.();
            }
        });
    },
    { deep: true }
);

const [cancelData, cancelForm, cancelDialog, openCancelDialog, saveCancel] = useEditData({ returnAsArray: true })
const [detailObat, detailObatDialog, closeDetailObat, openDetailObatDialog] = useViewData({ returnAsArray: true })
const [
    addData,
    addForm,
    addDialog,
    saveAdd,
    cancelAdd,
    requiredLabelLength,
    openDialog,
] = useAddData({ returnAsArray: true });
const [
    addDataService,
    addFormService,
    addDialogService,
    saveAddService,
    cancelAddService,
    requiredLabelLengthService,
    openDialogService,
] = useAddData({ returnAsArray: true });
const [masterTindakan, getMasterTindakan] = useGetData();
const [masterLayanan, getMasterLayanan] = useGetData();
const [serviceList, getServiceList, isLoadingGetService] = useGetData();
const { viewData, viewDialog, closeView, openViewDialog } = useViewData();
const { 1: fetchApi } = useGetData();

const { deleteData } = useDeleteData();

const emit = defineEmits(['accept-medicine', 'refresh-medicine', 'refresh-tindakan', 'click-detail-racikan', 'refresh']);

const getStatusColor = (status) => {
    switch (status) {
        case 'new':
            return 'bg-blue-400/60'; // Warna untuk status Baru
        case 'accepted':
            return 'bg-green-400/60'; // Warna untuk status Diproses
        case 'rejected':
            return 'bg-red-400/60 text-white'; // Warna untuk status Ditolak
        case 'changed':
            return 'bg-yellow-400/60'; // Warna untuk status Diganti
        case 'done':
            return 'bg-orange-500/60'; // Warna untuk status Selesai
        case 'completed':
            return 'bg-orange-500/60';
        default:
            return 'bg-gray-200/60'; // Warna default kalau tidak cocok
    }
};

function onAcceptMedicine(medsId) {
    emit('accept-medicine', medsId);
}

function onCancelMedicine(medsId) {
    const row = {
        queue_id: props.data.id,
        medicine_id: medsId.id
    }
    openCancelDialog(row);
}

function onSubmitCancel() {
    saveCancel(() => apiRejectMedicine(cancelData.value.queue_id, cancelData.value.medicine_id, cancelData.value), null, () => emit('refresh', props.data));
}

function fetchMedicine() {
    emit('refresh-medicine');
}

function fetchTindakan() {
    emit('refresh-tindakan');
}

function onDetailMedicine(item) {
    if (item.is_compound) {
        openViewDialog(item.compound_meds)
        // emit('click-detail-racikan', item.compound_meds)
    } else {
        openDetailObatDialog(item);
    }
}

function onAddManualTindakan() {
    addData.value.quantity = 1
    getMasterTindakan(apiMasterTindakan);
    openDialog(0);
}

function onAddManualService() {
    addDataService.value.quantity = 1
    getMasterLayanan(APISelectTipeLayanan);
    openDialogService(1);
}

const handleSelectTindakan = (id) => {
    const selected = masterTindakan.value.find(item => item.id === id)
    if (selected) {
        addData.value.procedure_name = selected.name
        addData.value.price = parseFloat(selected.total_fee)
    } else {
        addData.value.procedure_name = ''
        addData.value.price = 0
    }
}

function onSubmitManualTindakan() {
    addData.value.queueId = props.data.id;
    saveAdd(apiPostTindakan, () => emit('refresh', props.data));
}

function onSubmitManualLayanan() {
    addDataService.value.queueId = props.data.id;
    saveAddService(apiPostService, () => emit('refresh', props.data))
}

function onDeleteTindakan(id) {
    deleteData(apiDeleteTindakan, { id, queueId: props.data.id }, () => emit('refresh', props.data));
}

function onDeleteService(id) {
    deleteData(apiDeleteService, { id, queueId: props.data.id }, () => emit('refresh', props.data));
}

function fetchService() {
    getServiceList(() => apiListServiceByQueue(props.data.id), true, true);
}

function onChangeMedicinePrice(item) {
    const data = {
        total_price: item.total_price
    }
    fetchApi(() => apiMedicineChangePrice(item.queue_id, item.id, data), false, true, () => {
        emit('refresh', props.data);
        item.IS_CHANGE_PRICE = false;
    });
}

fetchService();

watch(
    () => props.data,
    () => {
        fetchService();
    }
);
</script>