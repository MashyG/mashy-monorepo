// 获取当前页面数据1
function getPageData() {
  return Array.from($(".item-content")).map((item) => {
    let system = item.querySelector(".item-name").innerText;
    let ul = item.querySelector(".item-description");
    let mb = ul.children.length > 1 ? ul.children[1].textContent : "";
    return {
      system,
      mb: mb.split("• ")[1] ?? "",
    };
  });
}
getPageData();

let errorImgs = new Set();
async function downloadImg(imageUrl, name) {
  await fetch(`${imageUrl}`, {
    headers: {
      cookie:
        "_gcl_au=1.1.1830891080.1730687872; __hs_opt_out=no; hubspotutk=cff2d2e675a442b23b6e7abcbb8d7c11; _vwo_uuid_v2=DB5A3E9C501340DEA86DDA7425260C8C2|00ee9c7fc2fa78d4335251ab92965e2d; _vwo_uuid=D7B4DBEADFCE4C75E5A374AE67D5B3660; _vwo_ds=3%3At_0%2Ca_0%3A0%241732606736%3A90.62536104%3A%3A%3A%3A3; _gid=GA1.3.256475554.1733710721; _vis_opt_s=8%7C; __hstc=123233876.cff2d2e675a442b23b6e7abcbb8d7c11.1730711814173.1733829543639.1733881353508.97; __hssrc=1; XSRF-TOKEN=eyJpdiI6ImJHOE9DdFhVRy9DdXRXSThiYklqL2c9PSIsInZhbHVlIjoiRkErZzY1bDlnWVB3ZnNNL2cyYmhwTmgwY2NxcFlsQURQTmwwM21JZWR0R1ZCTU96MEJZckprS2REZ09JSEVZOWVnQzRyeEVrQXpUSVdxU3Q3cktjN2NnUXorcFJjMlB0S2dIYXpjaWlwZkVvRnNjbFplZXJYejRjR3REV25xaDQiLCJtYWMiOiIzMTU1MWI4MjIxYTUwMjZkMjYxODZhZmJhZWI0NWY1MGIxMmU5NWJjZmZhMjk1ZDBiZTJiMWFhYTk0Y2MwMTFiIiwidGFnIjoiIn0%3D; laravel_session=eyJpdiI6ImErL3ljcmdiTHFYWURmUG9abW9uRUE9PSIsInZhbHVlIjoiQVhsMUE2bUlGcTJYL2Z3NGQrUG40bDV5ZWNWdlJNRHhuN1ZXOHNzWTRJKzJnL0tUOHh2S01ESVFkM2FiaG9SS2RhQUZsTkhUa1Q0b0pPSU9uODA0c3h0TlltdEprbG5icTZXZHYzN3lpaGJvaUhITXZEVDVxbytQdmZsY0VLcEMiLCJtYWMiOiIwMDVmYjYxMmRmNDg2MTBjMDZmNWIwNzFjZGM4MDFmNzg0MmQxNGU0Y2UzYjAzMzEwYmMxODUyZmRmZTljNWQ5IiwidGFnIjoiIn0%3D; gtm_page_view=13; __hssc=123233876.13.1733881353508; _rdt_uuid=1730688425419.4807c47d-8d00-46f7-a26b-926438d9d06f; _ga=GA1.3.1287227744.1730687872; _gat_gtag_UA_341778_1=1; _ga_K1TNNPLV4M=GS1.1.1733881312.105.1.1733882984.20.0.0; ssojumpstart_session=eyJpdiI6IlhQZ3lhQUt1QklpdjJWTVZnNzlGVlE9PSIsInZhbHVlIjoiWGJzWDljVzJGeDBvcTRrYmZSeVRXMm93dHZ1cVFCRXRzcGNDa0tkU2JVaFRBc1hkOHowd3UvYzZ1d2lETmd6QThvS3ZudklwYU9FdElFM0dGSnFvRVBBZ25vMDAwRVJjdjFuVGxUUk51YWlFOUJ2cnQxaXRlQ2pNdHBDOUFGdmMiLCJtYWMiOiJkMGI2MTJhNjQwZThmOTMyYmNmZTczYjJkNmYzM2E2YTUxY2QyMjI4MGE5MjBkN2Y0MWI1MWY0YmQ2ZjJmMDdkIiwidGFnIjoiIn0%3D",
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
      priority: "u=0, i",
      "sec-ch-ua":
        '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
    },
    referrerPolicy: "no-referrer",
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "include",
  })
    .then((response) => {
      // 检查响应是否成功
      if (!response.ok) throw new Error("Network response was not ok");
      return response.blob(); // 转换为 Blob 对象
    })
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = name; // 设置下载的文件名
      document.body.appendChild(link);
      link.click(); // 触发下载
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // 释放 Blob URL
    })
    .catch((error) => {
      console.log(imageUrl);
      errorImgs.add(imageUrl);
      console.error("下载失败:", error);
    });
}

async function getImg(system, mb) {
  const systemUrl = "https://www.supermicro.com/files_SYS/images/System/";
  const motherboardUrl =
    "https://www.supermicro.com/files_SYS/images/Motherboard/";

  const img0 = systemUrl + system + "_main.jpg";
  const img1 = systemUrl + system + "_callout_angle.JPG";
  const img2 = systemUrl + system + "_callout_top.JPG";
  const img3 = systemUrl + system + "_callout_front.JPG";
  const img4 = systemUrl + system + "_callout_rear.JPG";
  const img5 = mb ? motherboardUrl + mb + ".png" : "";
  const list = [img0, img1, img2, img3, img4, img5].filter((i) => i);

  for (let i = 0; i < list.length; i++) {
    try {
      await downloadImg(list[i], `${list[i]}`.split("/").pop());
    } catch (error) {
      console.log(error);
    }
  }
}

// 获取所有产品图片2
const allProductImgs = [
  {
    system: "SYS-510D-10C-FN6P",
    mb: "X12SDV-10C-SP6F",
  },
  {
    system: "SYS-110D-4C-FRAN8TP",
    mb: "X12SDV-4C-SPT8F",
  },
  {
    system: "SYS-110D-8C-FRAN8TP",
    mb: "X12SDV-8C-SPT8F",
  },
  {
    system: "SYS-510D-4C-FN6P",
    mb: "X12SDV-4C-SP6F",
  },
  {
    system: "SYS-110P-FRN2T",
    mb: "X12SPW-TF",
  },
];
async function downloadImgData() {
  for (let i = 0; i < allProductImgs.length; i++) {
    const { system, mb = "" } = allProductImgs?.[i] ?? {};
    try {
      await getImg(system, mb);
    } catch (error) {
      console.log(error);
    }
    console.log(errorImgs);
  }
  console.log("结束了");
}
downloadImgData();

// 获取错误图片3
async function getErrorImg() {
  let errorImgss = new Set();
  async function downloadImg(imageUrl, name) {
    await fetch(imageUrl, {
      headers: {
        cookie: `_vwo_uuid_v2=DC3B7E4571E26D9F4DD4BE22F1E23FAD0|1fc40484160882e4028417a4515fcaab; __hs_opt_out=no; hubspotutk=510c982a97129082702cb55749a9c2f0; _gcl_au=1.1.1830891080.1730687872; _vwo_uuid=DBD7A6805B2D0B55E400FD9F80AF4A8D5; _vis_opt_s=1%7C; countryCode=HK; currencyCode=USD; area-popup-agree=1; IsEmailSubscribe=1; _vwo_ds=3%3At_0%2Ca_0%3A0%241730775704%3A29.87873135%3A%3A28_0%3A5_0%2C4_0%3A5; _ga_KLDNK5SHG8=GS1.2.1730885656.1.0.1730885656.0.0.0; _ga_K1TNNPLV4M=deleted; _gid=GA1.2.1144393100.1731895589; _clck=1kpketr%7C2%7Cfr1%7C0%7C1770; _uetvid=4b248cc09b2211ef95e1f7def421080a; _ga_333G1N0HEC=GS1.1.1732104865.23.1.1732104867.58.0.0; _ga_N01FRJHBHN=GS1.1.1732104865.20.0.1732104867.0.0.0; configurator2_session=QtfFXapJxn0XbJHY8DVHqFL7EpedluSm7OJNmuB2; __hssrc=1; AKA_A2=A; __hstc=136383855.510c982a97129082702cb55749a9c2f0.1729650778888.1732359106723.1732364182652.29; PHPSESSID=n12qvj9h566fqg4sjvjc8vrr3f; CFID=50fe5170-1650-4d8d-b2b0-9e971258fe51; CFToken=0; XSRF-TOKEN=eyJpdiI6IkxBYzdFdVVSN0dHMEtiai9NdzVoRVE9PSIsInZhbHVlIjoiam1iQkJlbllIZDhHRCtYSTU1d3ovL0szNVJlRXk0QUQvbnVWdHZNZ05TMW54YTZJY1owdjdMQzh4TXE2cmwyRVA1aTEvUTlBQVAxNEtlZ3ZiZktObDJvYTlIZU9LcU9DcEdqTXd0YlZ0QXE4MEZxbm5FcGVqelNlT2JrczFDMysiLCJtYWMiOiI2ZmMyNDI3YjliYmFhNjMwNzg3MDUyYzM2MDJlZGRmNTQ1NDFhZTg1Zjc5MzQ3YjQ0ZjYyYjg1ZTAyYzhlMTRmIiwidGFnIjoiIn0%3D; laravel_session=eyJpdiI6IkhEZlhWUERwSFo3VUdKVmYwZGViNlE9PSIsInZhbHVlIjoib2FFZTM0TXYyaVNvV1BCQmJKa0R5R2pFbkVLRXZlbzJlNjFzczJVWVgzMFp3RVdCSzMzYVhXSVFDMGp1cWdSRXFGY3BCZ2c4WlRTT240MFhjR0VCMXNKV1lSOVc3SG1YS1BINGhwWUh0a1FrYVFGTUN6WTRsVFlIanRDM1dKRXQiLCJtYWMiOiJkZjI5ZTVlMzhhNWYyMGE4M2U4MWJhODdlZTRiNTJiYmQ2OWRjMWRmNzkzZjgwNDhmM2U5ODc0NmY4YzZhYzBkIiwidGFnIjoiIn0%3D; _rdt_uuid=1729650776097.2cf2bde9-061e-4edc-b53d-24ea10ca5e4e; _ga=GA1.2.1287227744.1730687872; _gat_gtag_UA_341778_1=1; gtm_page_view=13; __hssc=136383855.13.1732364182652; ssojumpstart_session=eyJpdiI6IldUYllNN0tKZkE1VXFBTHRZYUl4T3c9PSIsInZhbHVlIjoiZmFOeUFtTW1XaytaUG1lNTBXelhuYVpSSTFKRDNNcm9kdklmSVBwSTJHSUxmKzFRWUJoZlZWSzVnd3NmM1luNEtrdmE1RUdDOTBPSlp1U1lhQTF2eW9ZTEFUdlgzZlU2SmM1RXhxTXRQY2tDMVhZL3hmN25seXV5aTIzOEsvMXQiLCJtYWMiOiJmMmRmNGJkMGUwODMyMjIwZTI1MzdiMTIwZGQwYmM4Mzc5N2U0ODAxOTVhZTY2ODAzYjEyMjNjZGVhYTM3Mjg4IiwidGFnIjoiIn0%3D; RT="z=1&dm=supermicro.com&si=efe88fe7-e550-4a07-a38f-d4dac960ebf2&ss=m3u4wjbq&sl=c&tt=yv4&bcn=%2F%2F684d0d41.akstat.io%2F&ld=1n0re&ul=1n37b&hd=1n37k"; _ga_K1TNNPLV4M=GS1.1.1732364178.43.1.1732366935.54.0.0`,
      },
    })
      .then((response) => {
        // 检查响应是否成功
        if (!response.ok) throw new Error("Network response was not ok");
        return response.blob(); // 转换为 Blob 对象
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = name; // 设置下载的文件名
        document.body.appendChild(link);
        link.click(); // 触发下载
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // 释放 Blob URL
      })
      .catch((error) => {
        console.log(imageUrl);
        errorImgss.add(imageUrl);
        console.error("下载失败:", error);
      });
  }
  let errorImgs2 = new Set([
    "https://www.supermicro.org.cn/files_SYS/images/System/AS%20-1014S-WTRT_main.jpg",
  ]);

  for (let url of errorImgs2) {
    try {
      await downloadImg(url, url.split("/").pop());
    } catch (error) {
      console.log(error);
    }
    console.log(errorImgss);
  }
  console.log("结束了");
}
getErrorImg();

// new function -> 获取图片并下载
async function getImgUrl1() {
  return Array.from(
    document.querySelectorAll(
      ".fotorama__thumb.fotorama__loaded.fotorama__loaded--img"
    )
  ).map((item) => {
    return item.children[0].src;
  });
}
async function getImgUrl2() {
  return [
    document.querySelector(".spec-product-image.spec-table img").src,
    document.querySelector(".spec-product-board-image.spec-table a img").src,
    ...Array.from(
      document.querySelectorAll(".spec-product-image.spec-table strong a")
    ).map((item) => {
      return item.href;
      // return (
      //   "https://www.supermicro.org.cn" +
      //   item.href.replace("https://www.supermicro.com", "")
      // );
    }),
  ];
}
let errorImgss = new Set();
async function downloadImg(imageUrl) {
  const name = imageUrl.split("/").pop();
  const filterName = name.replace(/_callout/g, "");
  await fetch(imageUrl, {
    headers: {
      cookie: `_gcl_au=1.1.1830891080.1730687872; __hs_opt_out=no; hubspotutk=cff2d2e675a442b23b6e7abcbb8d7c11; _vwo_uuid_v2=DB5A3E9C501340DEA86DDA7425260C8C2|00ee9c7fc2fa78d4335251ab92965e2d; _gid=GA1.3.659292444.1732501338; _vwo_uuid=D7B4DBEADFCE4C75E5A374AE67D5B3660; _vwo_ds=3%3At_0%2Ca_0%3A0%241732606736%3A90.62536104%3A%3A%3A%3A3; _vis_opt_s=2%7C; __hstc=123233876.cff2d2e675a442b23b6e7abcbb8d7c11.1730711814173.1732704202772.1732758676856.53; __hssrc=1; CFID=0aa2e03b-6f48-4caa-80da-ce8bb45b3d5e; CFToken=0; XSRF-TOKEN=eyJpdiI6ImVaYkhZb3NXaGp6T3VCM0ZGWStucmc9PSIsInZhbHVlIjoiNnRBYTVaY3M3MmhGTXgrQ3VQM2JaWGkzSHVmRXBPdGFuUlhaajVCVExJZ3FyWjg0TFVvMksvTHFjK2pmVlFaZ1NBWGtURWRSY0NqK3hEcFhaTnJKcStEWnNjRU90eGdOdG5nYnhzNW1Cc2ZQNE1CQ2JwdzZmUnFzdmd4QW51UEgiLCJtYWMiOiI0NGU0ZTlhYTJkOWFkNTkyZmU5OWRkZGQ1MTYwZGRlYzQzZTgyZDYyM2M3NmJkOGNkOTBhODg5N2E0OWJjMTU1IiwidGFnIjoiIn0%3D; laravel_session=eyJpdiI6IjBjcmZxYVQ3SGRLSFJQRjFFdHZRNkE9PSIsInZhbHVlIjoiai9YV0dGcnJ2aWs0QytiU0pjc2dsaWh1cGQwY0IwNXcvbFpPSHRnN2p5bENoMFkxOGJCMytzSmlkaGNrd0Z2NmtwNUFpb0VYVmE3RTRTbmI3OFZ6RHRpZGYxT2hQTTYwdkhPa2JGOW5oc1lsbThNdlU4akR5QklwdlBsY05VVGciLCJtYWMiOiIwOWE2YTZjOTllMTJjMDZiNTNjY2EyYTFlYTRhN2Y5MzQyZWVlYmJkMWJjN2JiODg5NTM4MDJjYzczOTc0Mzg4IiwidGFnIjoiIn0%3D; _ga=GA1.1.1287227744.1730687872; _rdt_uuid=1730688425419.4807c47d-8d00-46f7-a26b-926438d9d06f; gtm_page_view=13; __hssc=123233876.14.1732758676856; _ga_K1TNNPLV4M=GS1.1.1732758651.55.1.1732763681.5.0.0; ssojumpstart_session=eyJpdiI6InJzU3daVzZIWVNEY3VXWEFlOFZOU3c9PSIsInZhbHVlIjoiUm9ybXBDSkxndEpwU282cEppTEc2cndOVXVjdkZlalh5OFBoM09FdG5pNkxBcFpmalAxcnNHYm1jdFZnZThTeFJaWGszYlYxS1FPQkNlNmpNdG0rUVIwcE5mU0Zlc3JXT2JxZGN3Vk9sYW5jclhwaXgyM2pzM294SDZUVHhaaDMiLCJtYWMiOiIxNTJjZmIwNzM3YWY5M2QzYTcxMzgyNDkxNzIwOGRmNzRlY2M5OWM5ODQ5YTBjNDhlMWNmZDgxZGQ2ZmEzOWQ3IiwidGFnIjoiIn0%3D`,
    },
  })
    .then((response) => {
      // 检查响应是否成功
      if (!response.ok) throw new Error("Network response was not ok");
      return response.blob(); // 转换为 Blob 对象
    })
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filterName; // 设置下载的文件名
      document.body.appendChild(link);
      link.click(); // 触发下载
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // 释放 Blob URL
    })
    .catch((error) => {
      console.log(imageUrl);
      errorImgss.add(imageUrl);
      console.error("下载失败:", error);
    });
}
async function getImgAndDownload() {
  const list = new Set(await getImgUrl2());
  console.log("list===>>>>>>", list);
  for (let item of list) {
    try {
      await downloadImg(item);
    } catch (error) {
      console.log(error);
    }
    console.log(errorImgss);
  }
  console.log("结束了");
}
getImgAndDownload();

// 获取产品链接，通过搜索
async function fetchSearchData(name) {
  const jsonData = await fetch(
    `https://api.addsearch.com/v1/search/5d447be16615d87ca9cf031909f90548?term=${name}&fuzzy=auto&collectAnalytics=false&page=1&limit=10&sort=relevance&order=desc&hierarchicalFacets=%5B%7B%22fields%22%3A%5B%22custom_fields.category%22%2C%22custom_fields.secondcategory%22%2C%22custom_fields.thirdcategory%22%5D%2C%22sortOrder%22%3A%22COUNT_DESC_NAME_ASC%22%7D%5D&filter=%7B%7D`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
        "sec-ch-ua":
          '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
      },
      referrerPolicy: "no-referrer",
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "omit",
    }
  ).then((res) => res.json());
  const { hits = [] } = jsonData || {};
  return hits?.length ? (hits[0]?.url ?? "") : "";
}
async function openPage(list) {
  const productNames = new Set(list ?? []);
  for (let item of productNames) {
    try {
      const openUrl = await fetchSearchData(item);
      window.open(openUrl, `newWindow${new Date().getTime()}`);
    } catch (error) {
      console.log(error);
    }
  }
  console.log("结束了");
}
openPage([
  "AS -1124US-TNR",
  "AS -1024US-TNR",
  "SYS-120TP-DC8TR",
  "SSG-121E-NE316R",
  "AS-1125HS-TNR",
  "SYS-110P-FWTR",
  "SYS-111AD-HN2",
  "SYS-120TP-DC9TR",
  "SYS-110P-WR",
  "SYS-110D-20C-FRDN8TP",
  "SYS-1029U-TR25MV",
  "SYS-E300-12D-8CN6P",
  "SYS-E300-12D-4CN6P",
  "SYS-E300-12D-10CN6P",
  "SYS-110D-20C-FRAN8TP",
]);

[
  "SSG-121E-NE316R",
  "SSG-641E-E1CR36H",
  "SSG-640SP-E1CR60",
  "SSG-6049P-E1CR60H",
  "SSG-6049P-E1CR45H",
  "",
].map(async (item) => {
  await fetch(
    `https://hz-productposting.alibaba.com/product/managementproducts/asyQueryProductsList.do?statisticsType=month&repositoryType=all&imageType=all&showPowerScore=&status=all&subject=${item}&showType=onlyMarket&page=1&size=50&ctoken=l1uhqkts7rir&_tb_token_=f8ee1d73e533b&_csrf_token_=7a08a093-5253-4cbc-8e8c-231573cce11d&lang=en_US`,
    {
      headers: {
        accept: "*/*",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
        "awsc-token":
          "T2gAPUEQk-Kp7MANvJD91Goq_7iwKe91vmDtTlft2QJW81pCjFJ-gHe30NIYhQpNevY=",
        "awsc-token-type": "pc",
        "bx-v": "2.5.22",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
      },
      referrer:
        "https://hz-productposting.alibaba.com/product/manage_products.htm?spm=a2747.premium-product.0.0.68643e5fmqQm3H",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "include",
    }
  ).then(async (res) => {
    var data = await res.json();
    console.log(item, "=============", data.count);
    return item;
  });
});
