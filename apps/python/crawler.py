import math
import re
import copy
import requests
from bs4 import BeautifulSoup   
import pandas as pd
from datetime import datetime

# 1. 遍历分类获取所有商品列表，
    # 1-1. 找是否有分页器，若有则根据商品数量计算出有多少页数据（一页15条数据）

# 所有类目列表
categoryList = []
# 所有商品列表
productList = []
baseUrl = "https://www.serverparts.pl"
pageSize = 15

# 过滤数字
def extract_amount(s):
    # 使用正则表达式匹配金额
    match = re.search(r'\$\s*([\d\s,]+(?:\.\d{2})?)', s)
    if match:
        # 去掉空格和千位分隔符
        amount = match.group(1).replace(' ', '').replace(',', '')
        return amount
    return None

# 请求页面
def fetch_page(url):
    try:
        # 发送 GET 请求
        response = requests.get(url)
        response.raise_for_status()  # 如果响应状态码不是 200，会抛出异常
        return response.text
    except requests.RequestException as e:
        print(f"请求失败: {e}")
        return None

# 获取商品信息
def get_product_info(soup):
    captions = soup.find_all('div', class_='caption')
    for item in captions:
        link = item.find('h3', class_='item-name').find('a')
        text = ""
        if link:
            text = link.get_text(strip=True)
        countDom = item.find('div', class_='item-footer').find('p', class_='item-price')
        count = ""
        if countDom:
            count = countDom.get_text(strip=True)
        descListDom = item.find('ul', class_='item-description').find_all('li')
        descList = []
        for desc in descListDom:
            descText = desc.get_text(strip=True)
            descList.append(descText)
        productList.append({
            'text': text,
            'count': count,
            'Net': extract_amount(count),
            'desc': descList
        })
# 获取商品列表
def get_page_product_list(soup, categories = None):
    if categories: 
        page = math.ceil(categories['count'] / pageSize)
        productUrls = baseUrl + categories['href']
        print("----------------------------------------")
        print(f"总页数: page: {page}")
        for i in range(1, page + 1):
            params = ''
            if i > 1:
                params = '?page=' + str(i)
            newHtmlUrl = productUrls + str(params)
            print("----------------------------------------")
            print(f"总页数: page: {page} ^^^ newHtmlUrl: {newHtmlUrl}")
            newHtml = fetch_page(newHtmlUrl)
            get_product_info(BeautifulSoup(newHtml, 'html.parser'))
    else:
        get_product_info(soup)

# 获取所有分类
def get_page_categories(soup):
    categories = soup.find_all('li', class_='list-group-item')
    lens = len(categories)
    if lens > 0:
        for item in categories:
            # 找到 a 标签
            link = item.find('a')
            if link:
                # 提取文本, count 属性，链接
                text = link.get_text(strip=True)
                href = link.get('href')
                count = int(link.get('attr-count'))
                if count > 0:
                    categoryList.append({'text': text, 'count': count, 'href': href, 'soup': soup})

def get_all_page_categories(soup):
    get_page_categories(soup)
    list = copy.deepcopy(categoryList)
    for category in list:
        categoryHref = category['href']
        categoryCount = category['count']
        print(f"类目列表: href: {categoryHref}, count: {categoryCount} len: {len(list)}")
        if categoryCount > 0:
            categoryUrl = baseUrl + categoryHref
            newHtml = fetch_page(categoryUrl)
            if newHtml:
                get_page_categories(BeautifulSoup(newHtml, 'html.parser'))

# 是否有分页器
def has_pagination(soup):
    pagination = soup.find('ul', class_='pagination')
    return pagination is not None

# 保存到 Excel 文件
def save_to_excel(data, name):
    df = pd.DataFrame(data)

    # 保存 DataFrame 到 Excel 文件
    now = datetime.now()
    milliseconds  = int(now.timestamp() * 1000)
    df.to_excel(f"{name}_{milliseconds}.xlsx", index=False)  # index=False 用于不保存行索引

# 开始解析
def parse_page(html):
    soup = BeautifulSoup(html, 'html.parser')

    print("----------------------------------------")
    # TODO 首页爬取 pagesize 不一样
    get_page_product_list(soup)
    print(f"{len(productList)}")

    print("----------------------------------------")
    # 获取所有分类
    get_all_page_categories(soup)
    lens = len(categoryList)
    print(f"类目列表数: len: {lens}")
    print("----------------------------------------")
    print("开始保存 categoryList 文件...")
    save_to_excel(categoryList, 'category')

    # 获取商品列表
    for item in categoryList:
        print(f"开始爬取类目: {item['text']}")
        categorySoup = item['soup']
        if categorySoup:
            get_page_product_list(item['soup'], item)

    print("----------------------------------------")
    print("开始保存 product 文件...")
    save_to_excel(productList, 'product')
    print(f"{len(productList)}")


def main():
    # url = input("请输入要爬取的 URL: ")
    url = "https://www.serverparts.pl/en"
    html = fetch_page(url)
    print("----------------------------------------")
    print("开始解析页面...")
    if html:
        parse_page(html)

if __name__ == "__main__":
    main()