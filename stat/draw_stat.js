let viewLineChartDom = document.getElementById('view-line-chart');
let viewLineChart = echarts.init(viewLineChartDom, 'dark');
let option;

window.addEventListener('resize', function () {
  viewLineChart.resize();
});

option = {
  color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
  backgroundColor: '#333333',
  //   title: {
  //     text: '每日浏览量'
  //   },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#222'
      }
    }
  },
  legend: {
    data: ['A营', '共创世界', '别针社区']
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  grid: {
    left: '10%',
    right: '10%',
    bottom: '5%',
    containLabel: true
  },
  xAxis: [
    {
      boundaryGap: false,
      data: ['2023-08-01', '2023-08-02', '2023-08-03', '2023-08-04', '2023-08-05']
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: 'A营',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(128, 255, 165)'
          },
          {
            offset: 1,
            color: 'rgb(1, 191, 236)'
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
      data: [140, 232, 101, 264, 90]
    },
    {
      name: '共创世界',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(0, 221, 255)'
          },
          {
            offset: 1,
            color: 'rgb(77, 119, 255)'
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
      data: [120, 282, 111, 234, 220]
    }
  ]
};

option && viewLineChart.setOption(option);