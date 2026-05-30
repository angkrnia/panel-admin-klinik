import { ElLoading, ElMessage } from "element-plus";
import { useAppStore } from "../store/appStore";
import Cookies from "js-cookie";
import { axiosAuth, axiosDownload } from "../config/axios";
import { jwtDecode } from "jwt-decode";
import { getDokterSelect } from "../api/dokterApi";
import { APIUploadPhotos } from "../api/apiHelper";
import { Activity, Box, BoxSelect, Clipboard, Clock, CreditCard, Database, Droplets, FileText, FlaskRound, Flower, HeartPulse, Home, Layers, ListCheck, Package, ShoppingCart, Store, Tag, Upload, User, UserCheck, Users } from "lucide-vue-next";

export const isObjectEmpty = (object) => {
    if (!object) return true;
    return Object.keys(object).length === 0;
};

export const messageInfo = (message, type) => {
    return ElMessage({
        message: message,
        type: type || "error",
        grouping: true,
    });
};

export const loading = () => {
    const load = ElLoading.service({
        lock: true,
        text: "Tunggu...",
        background: "rgba(0, 0, 0, 0.7)",
    });
    return load;
};

export const loadingScreen = () => {
    const load = ElLoading.service({
        lock: true,
        text: "Tunggu...",
        background: "rgba(0, 0, 0, 0.7)",
    });
    return load;
};

export function clearLocalStorage() {
    localStorage.clear();
}

export const isValElForm = (elForm) => {
    return new Promise((resolve) => {
        elForm.validate((isValid) => resolve(isValid));
    });
};

let timeout = null;
export const createDebounce = (fn = () => {}, time = 500) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        fn();
    }, time);
};

export const getDifferentObject = (object1, object2) => {
    let returnObj = {};
    Object.entries(object1).forEach((element) => {
        let arrayStr1;
        let arrayStr2;
        const [key, value] = element;
        if (Array.isArray(object1[key])) {
            arrayStr1 = JSON.stringify(object1[key]);
            arrayStr2 = JSON.stringify(object2[key]);
            if (arrayStr1 != arrayStr2) {
                returnObj[key] = value;
            }
        } else if (object1[key] != object2[key]) {
            returnObj[key] = value;
        }
    });
    return returnObj;
};

export function replaceNullWithEmptyString(obj) {
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, value === null ? "" : value]));
}

export function setAuthentication(token, refreshToken) {
    Cookies.set("TOKEN", token, { expires: 1 });
    axiosAuth.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axiosDownload.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    if (refreshToken) {
        localStorage.setItem("REFRESH_TOKEN", refreshToken);
    }

    const appStore = useAppStore();

    try {
        const decoded = jwtDecode(token);
        appStore.setProfileInfo(decoded);
        appStore.setAuthentication(true);
        appStore.setToken(token);

        appStore.setMenuList([...allMenus, ...adminMenus]);
        // if (decoded.role === "admin") {
        // } else if (decoded.role === "perawat") {
        //     appStore.setMenuList(allMenus);
        // }
    } catch (error) {
        appStore.setAuthentication(false);
        appStore.setToken(null);
        Cookies.remove("TOKEN");
        localStorage.clear();
    }
}

export const getFromLocalStorage = (key) => {
    try {
        const value = localStorage.getItem(key);
        return value !== null && value !== undefined ? value : null;
    } catch (error) {
        console.error(`Error retrieving key "${key}" from localStorage:`, error);
        return null;
    }
};

export function getRefreshToken() {
    return getFromLocalStorage("REFRESH_TOKEN");
}

export function onLogoutHandler() {
    const appStore = useAppStore();
    Cookies.remove("TOKEN");
    localStorage.clear();
    appStore.setToken(null);
    appStore.setAuthentication(false);
    window.location.href = "/login";
}

export function convertDate(dateString) {
    const d = new Date(dateString);
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Jakarta",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    }).formatToParts(d)
        .reduce((acc, p) => (acc[p.type] = p.value, acc), {});

    return `${parts.day} ${parts.month} ${parts.year}, ${parts.hour}:${parts.minute}:${parts.second}`;
}

export function labelPosition() {
    const isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
    if (isMobile) return "top";
    return "left";
}

export function dialogWidth(params) {
    const isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
    const isTablet = window.matchMedia("only screen and (min-width: 761px) and (max-width: 1024px)").matches;
    const isLaptop = window.matchMedia("only screen and (min-width: 1025px) and (max-width: 1440px)").matches;
    const isDesktop = window.matchMedia("only screen and (min-width: 1441px)").matches;

    if (isLaptop || isDesktop) {
        if (params?.onDesktop) return params?.onDesktop;
        return "45%";
    }

    if (isMobile) return "95%";
    if (isTablet) return "65%";
    if (isLaptop) return "50%";

    return "45%";
}

export function paramPaging(url, pageIndex, pageSize, textSearch, newObj) {
    const params = new URLSearchParams();

    if (pageIndex) params.append("page", pageIndex);
    if (pageSize) params.append("limit", pageSize);
    if (textSearch) params.append("search", textSearch);

    // Tambahkan key-value dari newObj jika ada
    if (newObj && typeof newObj === "object") {
        Object.keys(newObj).forEach((key) => {
            if (newObj[key]) params.append(key, newObj[key]);
        });
    }

    return `${url}?${params.toString()}`;
}

export function doctorListHelper(isLoading = false) {
    return new Promise(async (resolve) => {
        let load = null
        if (isLoading) {
            load = loading();
        }
        try {
            const result = await getDokterSelect();
            resolve(result.data.data);
        } catch (error) {
            console.error(error);
            resolve([]);
        } finally {
            if (load) {
                load.close();
            }
        }
    });
}

export function convertStatusName(status) {
    switch (status) {
        case "on waiting":
            return "Pemeriksaan Perawat";
        case "on_waiting":
            return "Pemeriksaan Perawat";
        case "waiting":
            return "Menunggu Panggilan Dokter";
        case "on process":
            return "Diperiksa Dokter";
        case "on_process":
            return "Diperiksa Dokter";
        case "done":
            return "Pengambilan Obat";
        case "canceled":
            return "Dibatalkan";
        case "completed":
            return "Selesai";
        case "skiped":
            return "Terlewat";
        default:
            return status;
    }
}

export function convertPaymentStatus(status) {
    switch (status) {
        case "waiting":
            return "Menunggu Pembayaran";
        case "processing":
            return "Sedang Diproses";
        case "done":
            return "Selesai";
        case "canceled":
            return "Dibatalkan";
        default:
            return status;
    }
}

export function paymentStatusClass(status) {
    switch (status) {
        case "waiting":
            return "bg-yellow-100 text-yellow-800";
        case "processing":
            return "bg-blue-100 text-blue-800";
        case "done":
            return "bg-green-100 text-green-800";
        case "canceled":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
}

export function copyToClipboard(text) {
    try {
        if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text);
            messageInfo("Text berhasil disalin", "success");
        } else {
            messageInfo("Browser tidak mendukupkan fitur salin", "warning");
        }
    } catch (error) {
        messageInfo("Gagal menyalin text", "error");
    }
}

export function uploadPhotosHelper(imageFiles) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await APIUploadPhotos(imageFiles);
            if (result.status == 200) {
                resolve(result.data.data);
            } else {
                reject([]);
            }
        } catch (error) {
            messageInfo(error?.response?.data?.message || "Gagal mengunggah foto", "error");
            resolve([]);
        }
    });
}

export function formatRibuan(value) {
    if (!value) return 0;
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function isOnMobileOrTablet() {
    const isMobileOrTablet = (window.matchMedia && window.matchMedia("only screen and (max-width: 1024px)").matches) || window.innerWidth <= 1024;

    return isMobileOrTablet;
}

export const convertRp = (money) => {
    if (!money) return "Rp 0";
    money = parseFloat(money);
    if (money % 1 !== 0) return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 1, maximumFractionDigits: 2 }).format(money);

    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(money);
};

export const dateFormatFull = (date) => {
    if (!date) return "";

    const newDate = new Date(date);
    if (isNaN(newDate)) return "";

    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

    const day = String(newDate.getDate()).padStart(2, "0");
    const month = months[newDate.getMonth()];
    const year = newDate.getFullYear();
    const hours = String(newDate.getHours()).padStart(2, "0");
    const minutes = String(newDate.getMinutes()).padStart(2, "0");

    return `${day} ${month} ${year} ${hours}:${minutes}`;
};

export const allMenus = [
    {
        seq: 1,
        title: "Dashboard",
        path: "/dashboard",
        hasChildren: false,
        icon: Home,
    },
    {
        seq: 2,
        title: "Antrian",
        path: "/antrian",
        hasChildren: false,
        icon: ListCheck,
    },
    {
        seq: 3,
        title: "Vital Sign",
        path: "/vital-sign",
        hasChildren: false,
        icon: HeartPulse,
    },
    {
        seq: 4,
        title: "Farmasi",
        path: "/pharmacy",
        hasChildren: false,
        icon: FlaskRound,
    },
    {
        seq: 5,
        title: "Master Data",
        path: "/data-pasien",
        hasChildren: true,
        icon: Database,
        children: [
            {
                seq: 1,
                title: "Data Pasien",
                path: "/data-pasien",
                hasChildren: false,
                icon: User,
            },
            {
                seq: 2,
                title: "Data Dokter",
                path: "/data-dokter",
                hasChildren: false,
                icon: UserCheck,
            },
            {
                seq: 3,
                title: "Tindakan",
                path: "/master/tindakan",
                hasChildren: false,
                icon: Activity,
            },
            {
                seq: 4,
                title: "Tipe Layanan",
                path: "/master/tipe-layanan",
                hasChildren: false,
                icon: Flower
            }
        ],
    },
    {
        seq: 6,
        title: "Transaksi",
        path: "/sales",
        hasChildren: false,
        icon: CreditCard,
    },
    {
        seq: 7,
        title: "Riwayat Kunjungan",
        path: "/histories",
        hasChildren: false,
        icon: Clock,
    },
    {
        seq: 8,
        title: "Fee Dokter",
        path: "/reports/doctor-fees",
        hasChildren: false,
        icon: FileText,
    },
];

export const adminMenus = [
    {
        seq: 9,
        title: "Inventory",
        path: "/inventory",
        hasChildren: true,
        icon: Box,
        children: [
            {
                seq: 1,
                title: "Master Obat",
                path: "/medicines",
                hasChildren: false,
                icon: BoxSelect,
            },
            {
                seq: 2,
                title: "Satuan",
                path: "/inventory/units",
                hasChildren: false,
                icon: Layers,
            },
            {
                seq: 3,
                title: "Grup",
                path: "/inventory/groups",
                hasChildren: false,
                icon: Users,
            },
            {
                seq: 4,
                title: "Kategori",
                path: "/inventory/categories",
                hasChildren: false,
                icon: Tag,
            },
            {
                seq: 5,
                title: "Supplier",
                path: "/inventory/suppliers",
                hasChildren: false,
                icon: Store,
            },
            {
                seq: 6,
                title: "Riwayat Stok",
                path: "/inventory/riwayat-stok",
                hasChildren: false,
                icon: Clock,
            },
        ],
    },
    {
        seq: 8,
        title: "Manajemen Obat",
        path: "/stock",
        hasChildren: true,
        icon: Package,
        children: [
            {
                seq: 1,
                title: "Obat Masuk",
                path: "/stock/stock-entry",
                hasChildren: false,
                icon: Upload,
            },
            {
                seq: 2,
                title: "Stock Opname",
                path: "/stock/stock-opname",
                hasChildren: false,
                icon: Clipboard,
            },
        ],
    },
    {
        seq: 10,
        title: "Analisis Kunjungan",
        path: "/reports/visit-time-analysis",
        hasChildren: false,
        icon: Activity,
    },
];

export const getStatusType = (status) => {
    switch (status) {
        case "NEW":
            return "primary";
        case "COMMITED":
            return "success";
        case "CANCEL":
            return "danger";
        default:
            return "info";
    }
};
export const getSalesStatusType = (status) => {
    switch (status) {
        case "PROCESSING":
            return "primary";
        case "SUCCESS":
            return "success";
        case "CANCELED":
            return "danger";
        default:
            return "info";
    }
};

export function sanitizeFilename(name) {
    return name.replace(/[:\s]/g, "-");
}

export function formatCurrencyToString(number) {
    if (number === null || number === undefined || isNaN(number)) return '-';

    const abs = Math.abs(number);
    let result = '';

    if (abs >= 1_000_000_000) {
        result = (number / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + ' m';
    } else if (abs >= 1_000_000) {
        result = (number / 1_000_000).toFixed(1).replace(/\.0$/, '') + ' jt';
    } else if (abs >= 1_000) {
        result = (number / 1_000).toFixed(0) + ' rb';
    } else {
        result = number.toString();
    }

    return result;
}

const escapeHtml = (s) =>
    s.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]))

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export function highlight(name, query) {
    if (!query) return escapeHtml(name)
    const re = new RegExp(`(${escapeRegExp(query)})`, 'ig')
    return escapeHtml(name).replace(re, '<span class="bg-yellow-200">$1</span>')
}





