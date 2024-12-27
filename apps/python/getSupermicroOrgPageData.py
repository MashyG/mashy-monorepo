from bs4 import BeautifulSoup
import requests

url = "https://www.supermicro.org.cn/zh_cn/products/system/1U/6019/SYS-6019U-TRTP.cfm"

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

def parse_page():
    html_content = fetch_page(url)
    soup = BeautifulSoup(html_content, 'html.parser')
    specs = {}
    # 提取 CPU 信息
    cpu_section = soup.find(string="CPU")
    if cpu_section and cpu_section.find_next():
        cpu_info = []
        # 获取CPU后面的所有相关信息
        for item in cpu_section.find_next_siblings():
            if item.name != 'div':  # 如果不是新的标题
                cpu_info.append(item.get_text().strip())
            else:
                break
        specs['CPU'] = ' '.join(cpu_info)

    # 提取 Form Factor
    form_factor = soup.find(string="Form Factor")
    if form_factor and form_factor.find_next():
        specs['Form Factor'] = form_factor.find_next().get_text().strip()

    # 提取 Model
    model = soup.find(string="Model")
    if model and model.find_next():
        specs['Model'] = model.find_next().get_text().strip()
    
    # 提取其他需要的信息
    # 可以继续添加其他字段的提取逻辑
    
    return specs

res = parse_page()
print(res)