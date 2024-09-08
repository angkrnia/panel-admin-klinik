import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { catchErrorFinally, catchError } from "../helpers/catchResp";

export default function usePagination() {
  const route = useRoute();
  const router = useRouter();
  const pageSizeEnv = parseInt(import.meta.env.VITE_PAGE_SIZE);
  const search = ref(null);
  const listData = ref(null);
  const rowTotal = ref(null);
  const newPageSize = ref(null);
  const pageIndex = computed(() =>
    route.query.page ? parseInt(route.query.page) : 1
  );
  const pageSize = computed(() =>
    route.query.limit
      ? parseInt(route.query.limit)
      : newPageSize.value || pageSizeEnv
  );
  const loading = ref(false);
  const filterData = ref({});
  const filterSearchData = ref({});
  const filterForm = ref(null);
  const isLastPage = ref(true);
  const links = ref([]);
  const currentPage = ref(1);
  let apiURLTemp;

  //SHOW LOADING FOR FIRST LOAD
  const getListData = (
    apiURL,
    objectIndex = pageIndex.value,
    objectSize = pageSize.value,
    textSearch = search.value,
    newObj = {},
    callback
  ) => {
    if (Object.keys(newObj).length) {
      Object.keys(newObj).forEach((el) => {
        if ((newObj[el] === null || newObj[el] === "") && newObj !== false) {
          delete newObj[el];
        }
      });
    }
    search.value = textSearch;
    loading.value = true;
    apiURLTemp = apiURL;

    if (listData.value?.length) {
      catchErrorFinally(
        async () => {
          const result = await apiURL(
            objectIndex,
            objectSize,
            textSearch,
            newObj
          );
          if (result.status == 200) {
            const response = result.data.data;
            listData.value = response.data;
            rowTotal.value = response.total;
            links.value = response.links;
            currentPage.value = response.current_page;
          } else if (result.status == 204) {
            listData.value = [];
            rowTotal.value = 0;
          }

          if (callback) callback(listData.value);
        },
        () => (loading.value = false)
      );
    } else {
      catchError(async () => {
        const result = await apiURL(
          objectIndex,
          objectSize,
          textSearch,
          newObj
        );
        if (result.status == 200) {
          const response = result.data.data;
          listData.value = response.data;
          rowTotal.value = response.total;
          links.value = response.links;
          currentPage.value = response.current_page;
        } else if (result.status == 204) {
          listData.value = [];
          rowTotal.value = 0;
        }
        if (callback) callback(listData.value);
        loading.value = false;
      });
    }
  };

  //SHOW FULL LOADING BEFORE THE DATA IS OBTAINED
  // const getListData = (apiURL, objectIndex = pageIndex.value, objectSize = pageSize.value, textSearch = search.value, newObj = {}) => {
  //   search.value = textSearch;
  //   // loading.value = true
  //   catchError(async () => {
  //     const result = await apiURL(objectIndex, objectSize, textSearch, newObj);
  //     if (result.status == 200) {
  //       listData.value = result.data?.data?.list;
  //       rowTotal.value = result.data?.data?.TOTAL_ROWS;
  //     } else if (result.status == 204) {
  //       listData.value = [];
  //     }
  //   });
  // };

  const changeIndex = (
    funcGetList,
    newIndex,
    newPageSize,
    newQuery = {},
    routerPush = true
  ) => {
    newQuery = { ...route.query, ...newQuery };
    newQuery.page = newIndex;
    newQuery.limit = newPageSize ? newPageSize : pageSize.value;

    for (const i in newQuery) {
      if (newQuery[i] === "" || newQuery[i] === null) {
        delete newQuery[i];
      }
    }

    if (routerPush) {
      router.push({
        path: route.path,
        query: newQuery,
      });
    } else {
      router.replace({
        path: route.path,
        query: newQuery,
      });
    }

    funcGetList();
  };

  const loadMoreData = () => {
    loading.value = true;

    if (listData.value?.length) {
      catchErrorFinally(
        async () => {
          const result = await apiURLTemp(
            pageIndex.value + 1,
            pageSize.value,
            search.value
          );
          if (result.status == 200) {
            listData.value = [...listData.value, ...result.data?.data?.list];
            rowTotal.value = result.data?.data?.TOTAL_ROWS;
            isLastPage.value =
              result.data?.data?.TOTAL_PAGES == result.data?.data?.CURRENT_PAGE;
          } else if (result.status == 204) {
            listData.value = [];
            rowTotal.value = 0;
          }
        },
        () => (loading.value = false)
      );
    } else {
      catchError(async () => {
        const result = await apiURL(
          objectIndex,
          objectSize,
          textSearch,
          newObj
        );
        if (result.status == 200) {
          listData.value = [...listData.value, ...result.data?.data?.list];
          rowTotal.value = result.data?.data?.TOTAL_ROWS;
          isLastPage.value =
            result.data?.data?.TOTAL_PAGES == result.data?.data?.CURRENT_PAGE;
          pageIndex.value++;
        } else if (result.status == 204) {
          listData.value = [];
          rowTotal.value = 0;
        }
        loading.value = false;
      });
    }
  };

  return {
    listData,
    rowTotal,
    pageIndex,
    pageSize,
    loading,
    getListData,
    changeIndex,
    filterData,
    filterSearchData,
    search,
    filterForm,
    newPageSize,
    loadMoreData,
    isLastPage,
    links,
    currentPage,
  };
}
