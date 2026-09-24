/* PROTOTYPE — deliberately fictional data, shared by all visual directions. */
window.StudyData = {
  total: '1,284,560.32', daily: '+28,411.00', dailyRate: '+2.26%', exposure: '85.9%', cash: '14.1%',
  stocks: [
    {name:'宁德时代', code:'300750', sector:'新能源', price:'201.35', change:'+3.20%', weight:'24.1%', profit:'+18.4%', status:'待审阅'},
    {name:'贵州茅台', code:'600519', sector:'消费', price:'1,689.00', change:'−0.80%', weight:'19.8%', profit:'+6.2%', status:'3 天前'},
    {name:'中际旭创', code:'300308', sector:'通信', price:'158.72', change:'+5.12%', weight:'14.3%', profit:'+42.7%', status:'待审阅'},
    {name:'比亚迪', code:'002594', sector:'新能源', price:'238.40', change:'+1.05%', weight:'11.2%', profit:'−2.1%', status:'昨天'},
    {name:'恒瑞医药', code:'600276', sector:'医药', price:'46.18', change:'−1.30%', weight:'9.1%', profit:'−5.6%', status:'5 天前'},
    {name:'工业富联', code:'601138', sector:'电子', price:'23.86', change:'+2.20%', weight:'7.4%', profit:'+12.5%', status:'今天'}
  ],
  reviews: [
    {title:'宁德时代 · 仓位建议更新', short:'仓位建议更新', tag:'仓位变化', before:'24.1%', after:'28.0%', description:'Q3 排产预期上修，新增两篇研究材料。', evidence:'两篇模拟研究材料更新了排产假设；建议仍待人工审阅。', caution:'行业需求低于预期时，结论可能失效。'},
    {title:'中际旭创 · 研究结论更新', short:'研究结论更新', tag:'新增证据', before:'原有结论', after:'新增反面证据', description:'800G 订单预期变化，新增一条反面证据。', evidence:'模拟订单追踪记录上修，同时补入需求集中度的反面材料。', caution:'证据存在分歧，需要继续核实。'},
    {title:'贵州茅台 · 风险阈值更新', short:'风险阈值更新', tag:'风险提醒', before:'¥1,580', after:'¥1,620', description:'波动率假设变化，建议重新审阅风险阈值。', evidence:'基于演示波动率序列重新计算参考阈值。', caution:'阈值仅为原型演示，不会触发任何账户操作。'}
  ],
  tasks:[
    {name:'单股研究', target:'中际旭创', status:'运行中', detail:'资料整合', progress:68},
    {name:'公告整理', target:'比亚迪', status:'排队中', detail:'等待前序任务'},
    {name:'低波红利回测', target:'策略中心', status:'需处理', detail:'缺少历史数据源'}
  ],
  series:{
    '1W':[1.236,1.243,1.239,1.251,1.249,1.257,1.255,1.271,1.266,1.278,1.274,1.285],
    '1M':[1.192,1.201,1.196,1.210,1.219,1.211,1.207,1.227,1.231,1.223,1.242,1.236,1.245,1.257,1.251,1.267,1.260,1.272,1.266,1.285],
    '3M':[1.100,1.126,1.114,1.140,1.127,1.154,1.168,1.149,1.177,1.190,1.180,1.201,1.216,1.204,1.229,1.240,1.228,1.258,1.249,1.285]
  }
};
