import { I18nData, type BaseData } from "./types";

export const getI18ns = (): Array<I18nData> => {
  return [
    {
      key: "zh",
      value: "中文",
    },
    {
      key: "en",
      value: "English",
    },
    {
      key: "ru",
      value: "Русский",
    },
  ];
};

export const getBaseData = (): BaseData => {
  return {
    headers: {
      leftData: {
        logo: "/logo.jpg",
        name: "润励科技",
      },
      rightData: {
        menus: [
          {
            key: "/",
            name: "首页",
          },
          {
            key: "/category",
            name: "产品分类",
          },
          {
            key: "/about",
            name: "关于我们",
          },
        ],
        searchBtn: {
          key: "/search",
          name: "搜索",
        },
        lang: "zh",
      },
    },
  };
};
