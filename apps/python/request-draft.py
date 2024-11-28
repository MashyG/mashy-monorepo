import requests
import pandas as pd
import logging

logging.basicConfig(level=logging.DEBUG)


# Define the URL for the request
url = "https://post.alibaba.com/product/submitDraft.json?pubType=null&from=common&notRefresh=false&X-XSRF-TOKEN=1d14e964-627b-4547-8970-93ca72f817f1"  # Replace with your actual endpoint


# Define the headers for the request
headers = {
  'origin': 'https://post.alibaba.com',
  'accept': 'application/json, text/plain, */*',
  'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Content-Type': 'application/x-www-form-urlencoded',
  'priority': 'u=1, i',
  'referer': 'https://post.alibaba.com/product/publish.htm?catId=708042',
  'x-xsrf-token': '1d14e964-627b-4547-8970-93ca72f817f1',
  'sec-fetch-site': 'same-origin',
  'sec-fetch-mode': 'cors',
  'x-requested-with': 'XMLHttpRequest',
  'cookie': '__wpkreporterwid_=25a9da71-a6a8-40e4-9d0d-f5cd9a2b902e; ali_apache_id=33.1.111.191.172965100881.699413.5; cna=Qk+fH664oRUCASuajdFzGYop; t=58d62eaf260ef7715e6700a7d0e97e77; cbc=T2gAan9ITbg0CEcmX6E0gmfSfqO_2Y2aIwvOXIFyUzpmRrurgXiRja5jc-PGM7R5kvQ=; havana_lgc2_4=; xman_i=aid=2218587894553; buyer_ship_to_info=local_country=US; _ym_uid=1730704601923925792; _ym_d=1730704601; recommend_login=email; _bl_uid=86mmm3R15Xhbehj32eRmbLd7kdtz; _ga_9RX53F1PN8=GS1.2.1730889285.3.0.1730889285.0.0.0; _ga=GA1.1.2041809050.1730704600; _samesite_flag_=true; _tb_token_=ee5bedee3b75; _m_h5_tk=5835426d0adb2c8034cadb5546a96024_1731469468901; _m_h5_tk_enc=1fea329c40d8da1c56799d61db75e8cf; ali_apache_tracktmp=W_signed=Y; intl_locale=zh_CN; XSRF-TOKEN=1d14e964-627b-4547-8970-93ca72f817f1; xman_us_f=x_locale=zh_CN&x_user=CN|MAX|HU|cgs|279814822&no_popup_today=n&last_popup_time=1731462132650&x_l=1; intl_common_forever=B2UbepYs/JT8iiTjqduGAnhUcU311zkX4D7E1nbR1Q5gVHb5/SB49Q==; xman_us_t=l_source=alibaba&sign=y&need_popup=y&x_user=V9A4+hwxIch+OvM7XX3CnUOYozk/OadMmIVhlVmKFxo=&ctoken=14kwrjlm5p2bc&x_lid=cn1569713381mzjw; xman_f=B3Izj6kkWXg3jYJoQo9y/QGX9pUNA+gc35FB7Kttt800WgxgOn6Glem2qjXyZrewQZr6/mZFKh9/gL8iUfSA6uBZJ42xJQD9SPnqhM674vBv1o6K+lVjxyj/YJT8RcOvd/kl5LUv6Cwh3l6lnpiQf+CS8oKxBfU4rJFxYcu6oFLwnXJztyPjC7j9K89m34l73y9j/eRdTNj0180/oZL4GcRxjuKeyZAA3r1FJj/Dz2TWj7zMwJOhPoLshBdwRRVv+VfzcRTu0ze+XA8yh8jhz1LvCk7drzmdt95RGqfimY5DaTKnGfbIHpdB+T6IJ9BydOUJvYbH1rncXqjTRerAl1BIEnqRvLA6UQta+1PcCY1wfC8upycrxw==; acs_usuc_t=acs_rt=6e123e4a583e4b36b704fc7a84b87bb6; cookie2=1487784e678fd6d1f3df721a1f70b2a2; sgcookie=E100XptRLXE1XXOjxx+bE1bRBXsnyqJZKJAjhrZx74NA8vrxW8LSNPJi5IBLpOqpaqxUYsZCgnFsZ1r5BW1Q8N71FuD/EMLxG1sD4hri6UyYOhY=; sc_g_cfg_f=sc_b_currency=USD&sc_b_locale=en_US&sc_b_site=US; _ym_isad=1; xlly_s=1; NWG=NNW; ali_apache_track=ms=|mt=3|mid=cn1569713381mzjw; _ga_RVSKK1KF5N=GS1.1.1731467818.29.0.1731467818.60.0.0; _uetsid=cc8215809fd111efb652597f8c65845c; _uetvid=bc46efa09a7c11efa045fd1c78669b71; cto_bundle=Iq9NWl80VVVZUG9oMkxqd3c2SlR5NHM5OU5mTmZIcUJkJTJGSjV2ZlMyeVFCcm9kb2E2dE50WEM5QkJyZnpCMHVFYlVQOU1rMGxQVUlyJTJCa1RUSCUyRkI4SlNaTDAyS1IyMm9YSHkxeWZQYTR2bGZHcGJBTSUyQk1xJTJCdktlaGZ6RiUyQmR2TFlYZ2hZa1N0VW9nNmw4bnZlQWlHTTZUcGVYRENSTXF5THlNRG9WRzVoMzVSbEZja21kdnVxWGFPT2pvZldVOW1GbFlNQkIlMkI5Z1ZMeko5cGJVcU1iQjlLZUlHMFElM0QlM0Q; umdata_=D60F209915555C7A582CB03C75138AFC19149ABB4FB530B8661A052305E13B545E5A90C6CECBF9E2CD43AD3E795C914CC5553BDB71270D0F111427111427DCFC; xman_t=G49n7tq5+UwJ+82HXct79hq3ZB74TKGTfg93ykIblqAwnysqxbcN4I+ymXoJ4s5e8FUZYqfu75JIp48Et2bDqo6XQOL/TLZd6H9501ONh+PSTfhZniKPQLS5uxk+/bIVXfkjpFWJKnPJAfY38J/A110UwCT+FTGI6WhF/YlZjAZ4a9smTxK1Rx4BsgHXRNhaktqkVZDHR0iID+UfkNPR5vKHm5dit+zYMYTIxy7kZL6yHe7tB2Y+BhNvekzdz1Vq9a2zWyo9Tqmpxa0CHR+doS+QeLX0Fix6uSq8RcWrnjzZpkbIRL+XM/WXD5H+IPwCv8ySwjUCmggIbsVz73zTsveSgyvq/FUhJe6Y7Gud3l8uuN8XgRBM2+yJlWGLR1WQweatstMAQkX6Wl8IdAkc9YWT4sqdufOK/fYS+GrpeeF/HB/AJkR9qhoYMIlwW00VGb5SiEse2f0ld8afyaLAyWl/aaR8dWEQzoJ2l5dWylziJg7NtVPIDKtE4VFyrn6IRNN6+x5DEI31Wa9HXoNq+Q0u0c9rtgrdkYTQnHuIhiVVSwsJg/Jzr6IE9OSPXhWTYUct+Cdmq/y9LZE/OdvxrbgdZ6kTS/5lbAgAAUi1T2KGuVO5s/MMwWLFWZgoREsFPlW4o/NGYD+G5BnXu4UnyAJiq932L2wlolO+wixIRo2bE1BKp/p4uFl0sZsm+JnL; ug_se_c=organic_1731468805123; tfstk=fNFo5-cwE8kWYwvmotl5LDiypmWYuUGQTkdKvXnF3mobveUr9vr3fPVJ9Xh-Y2r8DuHFFkCnKkEdPvSSwWq0Ryn894IS8oqYxvQ7waZY8yqb9LISvDy0VPrndaiKYDqL88QA61U7PXGUtGCO6y9vmhEn8voy0wui5DkwDRhYPXGFDgwFWSa7bVW3rWlFojuESQlELvR23mgpUDrE4x-qSVGETXrE0ruIRL-yUBzVo2iqYXlEw_prXWyagg3-NjBY8Qp-yYmaoOOkadgvXmzrmBREaaHrb_oDTBPmzrhqNMdGpcys2AnQ0sdotru3mAeljQq38PwEnWxPylz3nkG8gwJrb8E-p7HD4LuiZ0DaaY8kazMUnSc8aM9_krmrIjeAhgHKZu2sfYWfck4m2kPo33jxvRUYaxqNDIqIKJP-g7SVsg5w3dJfqBgVJSJBdYujocKafA0wUJeF_ZbDByMrlViOoZvBdYujocQcodFIUqgsX; icbu_s_tag=10_11; isg=BMrKjxDmmTFQnRWB9B-bobk9G7Bsu04VGbwAWlQdD5xPB_DB-EjpIT4xF3Pb1sat'
}

def get_json_body(data):
  return {
      "userId": '',
      "adminAliId": 2215963700689,
      "globalSwitcher": {
        "industryVerticalizationSwitcher": True,
        "hasImageAbility": True,
        "hasVideoAbility": True,
        "hasTitleAbility": True,
        "hasKeywordAbility": True,
        "hasDetailAbility": True,
        "hasOneClickAbility": False,
        "showTranslate": True,
        "openSemiManaged": True,
        "enableEasyListing": True,
        "openPriceDetection": True,
        "openPriceDetectionForTradeProduct": True,
        "ggsCollectProductCategorySwitcher": False,
        "ggsBatchAiSuggestionSwitcher": False,
        "productScoreUpgrade": True
      },
      "compLockData": [],
      "locale": {
        "baseCardTitle": {
          "title": "基本信息",
          "buttonType": "AI"
        },
        "tradeCardTitle": {
          "title": "交易信息",
          "subTitle": "完善交易信息，方便买家做出采购决定。"
        },
        "imageCardTitle": {
          "title": "商品图片"
        },
        "descCardTitle": {
          "title": "商品描述"
        },
        "logisticsCardTitle": {
          "title": "物流信息"
        },
        "packageCardTitle": {
          "title": "包装及发货信息"
        },
        "scmRegionCardTitle": {
          "title": "特殊服务及其它"
        },
        "productQualityFeedbackCardTitle": {},
        "exportCardTitle": {
          "title": "出口信息",
          "subTitle": "通过一达通报关出口时才需操作： 添加和复用，如不需通过一达通出口报关无需填写出口信息，请直接提交产品"
        },
        "categoryCardTitle": {
          "title": "产品类目",
          "subTitle": "请选择产品类目及类型"
        },
        "productPropertiesTitle": {
          "title": "产品属性",
          "subTitle": "商品属性"
        },
        "shippingCardTitle": {
          "title": "后勤",
          "subTitle": "物流及发货信息"
        },
        "icbuCatPropCardTitle": {
          "title": "产品属性",
          "subTitle": "完善产品属性，有助于提升商品成长分，增加商品曝光。"
        },
        "countryCardTitle": {
          "title": "目标国家/地区偏好"
        },
        "categoryChange": {
          "text": "切换类目和产品类型",
          "title": "确认操作",
          "content": "更换类目和产品类型后，编辑过且尚未保存的商品信息会丢失，确认更换？",
          "error": "系统错误"
        },
        "globalMessageTitle": "请发布前修改以下出错项：",
        "prevButton": {
          "text": "上一步"
        }
      },
      "currentPage": 0,
      "riskCheck": True,
      "initAction": "post_marketing",
      "formStyleControlName": '',
      "catId": '',
      "icbuCatProp": data['icbuCatProp'],
      "propertyExpandCollapse": False,
      "customMoreProperty": data['customMoreProperty'],
      "saleType": {
        "text": "按件卖",
        "value": "normal"
      },
      "scPrice": {
        "text": "根据数量设置FOB阶梯价",
        "value": 1
      },
      "productDescType": {
        "text": "智能编辑",
        "value": 1
      },
      "marketSample": {
        "text": "不支持",
        "value": 2
      },
      "staticText": "产品规格",
      "productVisible": {
        "text": "不支持",
        "value": 2
      },
      "warranty": {
        "text": "不支持",
        "value": 2
      },
      "icbuCountryRegion": [],
      "multilangInfo": {
        "productTitle": {},
        "productKeywords": [{}]
      },
      "dropShipping": {
        "text": "不支持",
        "value": 2
      },
      "sellScope": "全球买家",
      "supportLogisticsSku": False,
      "scImages": {
        "list": [{
          "shield": {
            "status": "none"
          },
          "quality": {
            "showError": False,
            "status": "done"
          },
          "fileSrcOrder": 0,
          "fileDestOrder": 1,
          "fileFlag": "add",
          "fileName": "Intel xeon",
          "fileSavePath": "Ha6c868e6cd5448f7a513f44c0fd6b180c.jpg",
          "imgURL": "//sc04.alicdn.com/kf/Ha6c868e6cd5448f7a513f44c0fd6b180c/273713219/Ha6c868e6cd5448f7a513f44c0fd6b180c.jpg_350x350.jpg",
          "fileURL": "//sc04.alicdn.com/kf/Ha6c868e6cd5448f7a513f44c0fd6b180c/273713219/Ha6c868e6cd5448f7a513f44c0fd6b180c.jpg",
          "fileId": 10308060797,
          "isError": False
        }, {
          "shield": {
            "status": "error"
          },
          "fileSrcOrder": 0,
          "fileDestOrder": 2,
          "fileFlag": "add",
          "fileName": "cpu4",
          "fileSavePath": "Ad8a3a9941d8a4ee18b1bc3259a54a38aN.png",
          "imgURL": "//sc04.alicdn.com/kf/Ad8a3a9941d8a4ee18b1bc3259a54a38aN/273713219/Ad8a3a9941d8a4ee18b1bc3259a54a38aN.png_350x350.png",
          "fileURL": "//sc04.alicdn.com/kf/Ad8a3a9941d8a4ee18b1bc3259a54a38aN/273713219/Ad8a3a9941d8a4ee18b1bc3259a54a38aN.png",
          "fileId": 6237844698,
          "isError": False
        }, {
          "shield": {
            "status": "error"
          },
          "fileSrcOrder": 0,
          "fileDestOrder": 3,
          "fileFlag": "add",
          "fileName": "cpu3",
          "fileSavePath": "A7e9fd2ae7b4249179c6af45dab005da4r.png",
          "imgURL": "//sc04.alicdn.com/kf/A7e9fd2ae7b4249179c6af45dab005da4r/273713219/A7e9fd2ae7b4249179c6af45dab005da4r.png_350x350.png",
          "fileURL": "//sc04.alicdn.com/kf/A7e9fd2ae7b4249179c6af45dab005da4r/273713219/A7e9fd2ae7b4249179c6af45dab005da4r.png",
          "fileId": 6236441309,
          "isError": False
        }, {
          "shield": {
            "status": "error"
          },
          "fileSrcOrder": 0,
          "fileDestOrder": 4,
          "fileFlag": "add",
          "fileName": "cpu2",
          "fileSavePath": "Aaad25db632ce4be792cf7d10f088ebdcZ.png",
          "imgURL": "//sc04.alicdn.com/kf/Aaad25db632ce4be792cf7d10f088ebdcZ/273713219/Aaad25db632ce4be792cf7d10f088ebdcZ.png_350x350.png",
          "fileURL": "//sc04.alicdn.com/kf/Aaad25db632ce4be792cf7d10f088ebdcZ/273713219/Aaad25db632ce4be792cf7d10f088ebdcZ.png",
          "fileId": 6236069914,
          "isError": False
        }, {
          "shield": {
            "status": "error"
          },
          "fileSrcOrder": 0,
          "fileDestOrder": 5,
          "fileFlag": "add",
          "fileName": "cpu1",
          "fileSavePath": "A1271e0df1163415db26b67122a05d43db.png",
          "imgURL": "//sc04.alicdn.com/kf/A1271e0df1163415db26b67122a05d43db/273713219/A1271e0df1163415db26b67122a05d43db.png_350x350.png",
          "fileURL": "//sc04.alicdn.com/kf/A1271e0df1163415db26b67122a05d43db/273713219/A1271e0df1163415db26b67122a05d43db.png",
          "fileId": 6236081814,
          "isError": False
        }, {
          "shield": {
            "status": "none"
          },
          "fileSrcOrder": 0,
          "fileDestOrder": 6,
          "fileFlag": "add",
          "fileName": "cpu9",
          "fileSavePath": "A9dd971ed99494abfa808a60d86f276e0y.jpg",
          "imgURL": "//sc04.alicdn.com/kf/A9dd971ed99494abfa808a60d86f276e0y/273713219/A9dd971ed99494abfa808a60d86f276e0y.jpg_350x350.jpg",
          "fileURL": "//sc04.alicdn.com/kf/A9dd971ed99494abfa808a60d86f276e0y/273713219/A9dd971ed99494abfa808a60d86f276e0y.jpg",
          "fileId": 6234604193,
          "isError": False
        }],
        "fileType": "DYNAMIC"
      },
      "productKeywords": ["Intel CPU Processor 128-core 96-core 84-core 64-core 48-core 32-core 24-core 16-core SP3 SP5 Socket 200W 280W 320W 360W 400W TDP ECC DDR4 3200 MHz DDR5 High Performance Memory Data Center Cloud Computing Virtualization Solutions Enterprise Server Scalability Multi-threading Technology Advanced Cooling Solutions Machine Learning"],
      "saleProp": {
        "p-3": []
      },
      "newCustomizedServices": "{\"customContent\":[]}",
      "shippingTemplate": '',
      "boxPackaging": [],
      "productTitle": "Intel " + data['name'] + " CPU Processor",
      "priceUnit": {
        "text": "Piece/Pieces",
        "value": 4
      },
      "ladderPrice": [{
        "price": data['price'],
        "quantity": "2"
      }],
      "ladderPeriod": [{
        "day": "3",
        "quantity": "2"
      }],
      "extraData": "{\"pageId\":\"2b9a8dd121013b3e1731468707\"}"
    }

def get_excel_data():
    df = pd.read_excel('./data.xlsx')
    # 将 DataFrame 转换为 NumPy 数组
    data_array = df.to_numpy()
    # print(data_array)
    return data_array

def req_draft():
  print("request draft...")

  productList = get_excel_data()
  
  for item in productList:
    # Define the JSON body for the form data
    formdata = {
      # Add your form data fields here
      "catId": "708042",
      "jsonBody": get_json_body({
          'name': item[2],
          'price': item[3],
          'customMoreProperty': item[4],
          'icbuCatProp': item[5]
      })
      # Extend this dictionary with the relevant form data
    }

    try:
      response = requests.post(url, data=formdata, headers=headers)
      logging.debug('=====', response)
    except requests.exceptions.RequestException as e:
      print(f"请求失败: {e}")

    # Send the POST request
    # response = 
    # print(response)
    # # Check the response
    # if response.status_code == 200:
    #     print("Request was successful.")
    #     print("Response data:", response.json())  # or response.text if not JSON
    # else:
    #   print("Request failed with status code:", response.status_code)
    #   print("Response message:", response.text)
    

req_draft()