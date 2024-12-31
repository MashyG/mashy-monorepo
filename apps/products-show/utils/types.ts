// 菜单子项类型
export interface MenuItem {
  key: string;
  name: string;
  desc?: string;
}

// 搜索按钮类型
export interface SearchButton {
  key: string;
  name: string;
}

// 头部左侧数据类型
export interface HeaderLeftData {
  logo: string;
  name: string;
}

export type I18ns = "zh" | "en" | "ru";

export interface I18nData {
  key: I18ns;
  value: string;
}

// 头部右侧数据类型
export interface HeaderRightData {
  menus: MenuItem[];
  searchBtn: SearchButton;
  lang: I18ns;
}

// 头部数据类型
export interface Headers {
  leftData: HeaderLeftData;
  rightData: HeaderRightData;
}

// 基础数据类型
export interface BaseData {
  headers: Headers;
}

export interface ProductItem {
  id: string;
  name: string;
  beforePrice?: string;
  price: string;
  image: string;
  desc: string;
}
