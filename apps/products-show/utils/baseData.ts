import { I18nData, ProductItem, type BaseData } from "./types";

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

export const getBannerImages = (): Array<string> => {
  return [
    "https://s.alicdn.com/@sc02/kf/A859e9c8dbae741dd81e3be38aae65327Z.jpg?hasNWGrade=1",
    "https://s.alicdn.com/@sc02/kf/A859e9c8dbae741dd81e3be38aae65327Z.jpg?hasNWGrade=1",
    "https://s.alicdn.com/@sc02/kf/A3e74ea099bb8486aac7baa5ba4a26e4aU.jpg?hasNWGrade=1",
  ];
};

export const getProducts = (): Array<ProductItem> => {
  return [
    {
      id: "1",
      name: "产品1",
      desc: "产品描述1产品描述1产品描述1产品描述1产品描述1产品描述1产品描述1产品描述1产品描述1产品描述1产品描述1产品描述1",
      beforePrice: "$50",
      price: "$39",
      image:
        "https://s.alicdn.com/@sc02/kf/A859e9c8dbae741dd81e3be38aae65327Z.jpg?hasNWGrade=1",
    },
    {
      id: "1",
      name: "产品1",
      desc: "产品描述1",
      beforePrice: "$50",
      price: "$39",
      image:
        "https://s.alicdn.com/@sc02/kf/A859e9c8dbae741dd81e3be38aae65327Z.jpg?hasNWGrade=1",
    },
    {
      id: "1",
      name: "产品1",
      desc: "产品描述1",
      beforePrice: "$50",
      price: "$39",
      image:
        "https://s.alicdn.com/@sc02/kf/A859e9c8dbae741dd81e3be38aae65327Z.jpg?hasNWGrade=1",
    },
    {
      id: "1",
      name: "产品1",
      desc: "产品描述1",
      beforePrice: "$50",
      price: "$39",
      image:
        "https://s.alicdn.com/@sc02/kf/A859e9c8dbae741dd81e3be38aae65327Z.jpg?hasNWGrade=1",
    },
    {
      id: "1",
      name: "产品1",
      desc: "产品描述1",
      beforePrice: "$50",
      price: "$39",
      image:
        "https://s.alicdn.com/@sc02/kf/A859e9c8dbae741dd81e3be38aae65327Z.jpg?hasNWGrade=1",
    },
    {
      id: "1",
      name: "产品1",
      desc: "产品描述1",
      beforePrice: "$50",
      price: "$39",
      image:
        "https://s.alicdn.com/@sc02/kf/A859e9c8dbae741dd81e3be38aae65327Z.jpg?hasNWGrade=1",
    },
  ];
};

export interface ContactUsData {
  name: string;
  companyName: string;
  contactInfo: string;
  desc: string;
}
export const submitContactUsData = async (data: ContactUsData) => {
  console.log("submitContactUsData  ======>   ", data);
};
