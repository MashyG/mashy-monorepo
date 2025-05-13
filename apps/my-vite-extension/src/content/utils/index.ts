/*
 * 根据数据分析逻辑筛选热门商品
 * @param {Array} data 输入的商品数据数组
 * @returns {Array} 包含核心指标的热门商品列表
 */
export function filterPopularProducts(data: Array<any>) {
  // 数据清洗：转换字符串数值
  const parseNumber = (str: any) => parseFloat(String(str).replace(/[^0-9.]/g, '')) || 0

  return data
    .map(item => ({
      ...item,
      // 转换关键指标为数字
      online_products: parseNumber(item.online_products),
      l30d_sales_volume: parseNumber(item.l30d_sales_volume),
      gmv_l30d: parseNumber(item.gmv_l30d),
      l30d_sales_volume_ring_ratio: parseNumber(item.l30d_sales_volume_ring_ratio),
      recommend_price_low: parseNumber(item.recommend_price_low)
    }))
    .filter(item => {
      // 核心筛选条件
      const isHighSales = item.l30d_sales_volume >= 5000 // 销量门槛
      const isGrowing = item.l30d_sales_volume_ring_ratio >= 30 // 增长率≥30%
      const isLowCompetition = item.online_products <= 10 // 竞争度≤10个商品
      const isMidHighPrice = item.recommend_price_low >= 150 && item.recommend_price_low <= 400 // 价格带

      return (isHighSales || isGrowing) && (isLowCompetition || isMidHighPrice)
    })
    .sort((a, b) => {
      // 排序优先级：增长率 > GMV > 销量
      const growthDiff = b.l30d_sales_volume_ring_ratio - a.l30d_sales_volume_ring_ratio
      if (growthDiff !== 0) return growthDiff

      const gmvDiff = b.gmv_l30d - a.gmv_l30d
      if (gmvDiff !== 0) return gmvDiff

      return b.l30d_sales_volume - a.l30d_sales_volume
    })
    .map(item => ({
      // 输出关键字段
      lead_id: item.lead_id,
      lead_name: item.lead_name,
      pic_url: item.pic_url[0], // 取首张图片
      category: item.level3_cate_name,
      metrics: {
        l30d_sales: item.l30d_sales_volume,
        growth_rate: `${item.l30d_sales_volume_ring_ratio}%`,
        gmv: `₱${item.gmv_l30d.toLocaleString()}`,
        competition: item.online_products,
        price_range: `₱${item.recommend_price_low}${item.recommend_price_high ? `-₱${parseNumber(item.recommend_price_high)}` : ''}`
      },
      // 生成核心数据亮点描述
      highlight: [
        `销量: ${item.l30d_sales_volume.toLocaleString()}（${item.l30d_sales_volume_ring_ratio}%增长）`,
        `GMV: ₱${item.gmv_l30d.toLocaleString()}`,
        `竞争度: ${item.online_products}个在线商品`,
        item.online_products === 1 ? '蓝海市场' : ''
      ]
        .filter(Boolean)
        .join(' | ')
    }))
}
