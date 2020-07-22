const icons = {
  '1': { id: 1, name: '人生梦想', color: '' },
  '2': { id: 2, name: '事业梦想', color: '' },
  '3': { id: 3, name: '目标计划内容', color: '#db1717', icon: 'icon-G' },
  '4': { id: 4, name: '目标计划步骤', color: '#db1717', icon: 'icon-G' },
  '5': { id: 5, name: '年度', color: '#ff7700', icon: 'icon-Y' },
  '6': { id: 6, name: '月计划目标', color: '#ffaa00', icon: 'icon-M' },
  '7': { id: 7, name: '月计划紧要事项', color: '#ffaa00', icon: 'icon-M' },
  '8': { id: 8, name: '月计划重要事项', color: '#ffaa00', icon: 'icon-M' },
  '9': { id: 9, name: '周计划紧要事项', color: '#04ae0f', icon: 'icon-W' },
  '10': { id: 10, name: '周计划重要事项', color: '#04ae0f', icon: 'icon-W' },
  '11': { id: 11, name: '日计划紧要事项', color: '#1dd3d1', icon: 'icon-D' },
  '12': { id: 12, name: '日计划重要事项', color: '#1dd3d1', icon: 'icon-D' }
}

function icon(type) {
  return icons[type]
}

export { icon }

// iconColors: {
//   $colorG: '#db1717',
//   $colorY: '#ff7700',
//   $colorM: '#ffaa00',
//   $colorW: '#04ae0f',
//   $colorD: '#1dd3d1',
//   $colorA: '#00a0e9',
//   $colorC: '#0066ff',
//   $colorF: '#a65fec',
//   $colorL: '#ec5fe7',
//   $colorH: '#e22c79'
// },
