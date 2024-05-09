// #CHART 1 
import { getAnalysis } from './firebaseConfig.js';

async function getDaysData(startDate, endDate) {
  const daysData = {};
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateString = d.toDateString();
    const data = await getAnalysis(d);
    daysData[dateString] = data;
  }
  return daysData;
}

// Hàm tính giá trị trung bình cho mỗi ngày
function calculateAveragedData(daysData) {
  const averagedData = {};
  for (const day in daysData) {
    if (Object.hasOwnProperty.call(daysData, day)) {
      const data = daysData[day];
      const entries = Object.entries(data);
      const averagedValues = {};
      for (const key in entries[0][1]) {
        if (Object.hasOwnProperty.call(entries[0][1], key)) {
          const values = entries.map(entry => entry[1][key]);
          const average = values.reduce((acc, curr) => acc + curr, 0) / values.length;
          averagedValues[key] = average;
        }
      }
      averagedData[day] = averagedValues;
    }
  }
  return averagedData;
}

document.addEventListener("DOMContentLoaded", () => {
  const chart = new ApexCharts(document.querySelector("#reportsChart1"), {
    series: [{
      name: 'PM 2.5',
      data: [12, 33, 22, 115, 12, 34, 42, 11, 33, 22, 45, 12, 34] //truyền data PM2.5
    }, {
      name: 'MQ135',
      data: [22, 45, 12, 34, 42, 11, 33, 22, 45, 12, 34, 42, 12] //truyền data MQ135
    }],
    chart: {
      height: 350,
      type: 'area',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: true
      },
      pan: {
        enabled: true,
        type: 'x',
        rangeSelector: {
          enabled: true
        }
      },
    },
    markers: {
      size: 4
    },
    colors: ['#FF0000', '#8B322C'],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.4,
        stops: [0, 90, 100]
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      type: 'datetime',
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm'
      },
    }
  });
  chart.render();



  //OPTION 24 HOURS AGO 
  document.getElementById('chart1_24h').addEventListener('click', async() => {
    const currentDate = new Date();
    const data = await getAnalysis(currentDate);
    console.log(data);

    // Tạo mảng chứa timestamp cho mỗi giờ trong 24 giờ trước đó
    const timestamps = Object.keys(data);
    const seriesData = Object.values(data);
    const pm25 = seriesData.map(item => item.dust);// Đổi đơn vị
    const mq135 = seriesData.map(item => item.ppm);

    // Thực hiện thay đổi trục hoành để hiển thị dữ liệu trong 24 giờ trước đó
    chart.updateOptions({
      series: [{
        name: 'PM 2.5',
        data: pm25
      }, {
        name: 'MQ135',
        data: mq135
      }],
      xaxis: {
        type: 'category',
        categories: timestamps,
        min: 0,
        max: 23,
        labels: {
          rotate: -45,
          formatter: function (value) {
            return `${value}h`;
          }
        }
      }
    }, false, true);
  });

  // OPTION 7 DAYS AGO  
  document.getElementById('chart1_7days').addEventListener('click', async () => {
    const currentDate = new Date();
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 6);
    const daysData = await getDaysData(startDate, endDate);

    // Tạo mảng chứa giá trị trung bình cho mỗi ngày
    const averagedData = calculateAveragedData(daysData);

    // Tạo mảng các ngày để hiển thị trên trục hoành
    const days = Object.keys(averagedData);

    // Cập nhật dữ liệu trên biểu đồ
    chart.updateOptions({
      series: [{
        name: 'PM 2.5',
        data: Object.values(averagedData).map(item => item.dust)
      }, {
        name: 'MQ135',
        data: Object.values(averagedData).map(item => item.ppm)
      }],
      xaxis: {
        type: 'category',
        categories: days,
        labels: {
          rotate: -45,
          formatter: function (value) {
            // Chỉ lấy tháng và ngày từ chuỗi ngày tháng
            return value.split(' ').slice(1, 3).join(' ');
          }
        }
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return value.toFixed(2); // Làm tròn giá trị không có chấm thập phân
          }
        }
      }
    }, false, true);
  });

  //OPTION 30 DAYS AGO 
  document.getElementById('chart1_30days').addEventListener('click', async () => {
    const currentDate = new Date();
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 29);
    const daysData = await getDaysData(startDate, endDate);

    // Tạo mảng chứa giá trị trung bình cho mỗi ngày
    const averagedData = calculateAveragedData(daysData);

    // Tạo mảng các ngày để hiển thị trên trục hoành
    const days = Object.keys(averagedData);

    // Cập nhật dữ liệu trên biểu đồ
    chart.updateOptions({
      series: [{
        name: 'PM 2.5',
        data: Object.values(averagedData).map(item => item.dust)
      }, {
        name: 'MQ135',
        data: Object.values(averagedData).map(item => item.ppm)
      }],
      xaxis: {
        type: 'category',
        categories: days,
        labels: {
          rotate: -45,
          formatter: function (value) {
            // Chỉ lấy tháng và ngày từ chuỗi ngày tháng
            return value.split(' ').slice(1, 3).join(' ');
          }
        }
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return value.toFixed(2); // Làm tròn giá trị không có chấm thập phân
          }
        }
      }
    }, false, true);
  });
});

// # CHART 2 
document.addEventListener("DOMContentLoaded", () => {
  const chart = new ApexCharts(document.querySelector("#reportsChart2"), {
    series: [{
      name: 'TDS',
      data: [15, 11, 10, 18, 1, 2, 1]
    }, {
      name: 'Humidity',
      data: [30, 18, 45, 32, 38, 39, 35]
    }, {
      name: 'Temperature',
      data: [24, 14, 32, 19, 15, 15, 20]
    }],
    chart: {
      height: 350,
      type: 'area',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: true
      },
      pan: {
        enabled: true,
        type: 'x',
        rangeSelector: {
          enabled: true
        }
      }
    },
    markers: {
      size: 4
    },
    colors: ['#4154f1', '#10439F', '#FFA447'],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.4,
        stops: [0, 90, 100]
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      type: 'datetime',
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm'
      }
    }
  });
  chart.render();

  document.getElementById('chart2_24h').addEventListener('click', async() => {
    const currentDate = new Date();
    const data = await getAnalysis(currentDate);
    console.log(data);

    // Tạo mảng chứa timestamp cho mỗi giờ trong 24 giờ trước đó
    const timestamps = Object.keys(data);
    const seriesData = Object.values(data);
    const tds = seriesData.map(item => item.tds);
    const hum = seriesData.map(item => item.humidity);
    const temp = seriesData.map(item => item.temperature);

    // Thực hiện thay đổi trục hoành để hiển thị dữ liệu trong 24 giờ trước đó
    chart.updateOptions({
      series: [{
        name: 'TDS',
        data: tds
      }, {
        name: 'Humidity',
        data: hum
      }, {
        name: 'Temperature',
        data: temp
      }],
      xaxis: {
        type: 'category',
        categories: timestamps,
        min: 0,
        max: 23,
        labels: {
          rotate: -45,
          formatter: function (value) {
            return `${value}h`;
          }
        }
      }
    }, false, true);
  });

  document.getElementById('chart2_7days').addEventListener('click', async() => {
    const currentDate = new Date();
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 6);
    const daysData = await getDaysData(startDate, endDate);

    // Tạo mảng chứa giá trị trung bình cho mỗi ngày
    const averagedData = calculateAveragedData(daysData);

    // Tạo mảng các ngày để hiển thị trên trục hoành
    const days = Object.keys(averagedData);

    // Cập nhật dữ liệu trên biểu đồ
    chart.updateOptions({
      series: [{
        name: 'TDS',
        data: Object.values(averagedData).map(item => item.tds)
      }, {
        name: 'Humidity',
        data: Object.values(averagedData).map(item => item.humidity)
      }, {
        name: 'Temperature',
        data: Object.values(averagedData).map(item => item.temperature)
      }],
      xaxis: {
        type: 'category',
        categories: days,
        labels: {
          rotate: -45,
          formatter: function (value) {
            // Chỉ lấy tháng và ngày từ chuỗi ngày tháng
            return value.split(' ').slice(1, 3).join(' ');
          }
        }
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return value.toFixed(2); // Làm tròn giá trị không có chấm thập phân
          }
        }
      }
    }, false, true);
  });

  document.getElementById('chart2_30days').addEventListener('click', async() => {
    const currentDate = new Date();
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 29);
    const daysData = await getDaysData(startDate, endDate);

    // Tạo mảng chứa giá trị trung bình cho mỗi ngày
    const averagedData = calculateAveragedData(daysData);

    // Tạo mảng các ngày để hiển thị trên trục hoành
    const days = Object.keys(averagedData);

    // Cập nhật dữ liệu trên biểu đồ
    chart.updateOptions({
      series: [{
        name: 'TDS',
        data: Object.values(averagedData).map(item => item.tds)
      }, {
        name: 'Humidity',
        data: Object.values(averagedData).map(item => item.humidity)
      }, {
        name: 'Temperature',
        data: Object.values(averagedData).map(item => item.temperature)
      }],
      xaxis: {
        type: 'category',
        categories: days,
        labels: {
          rotate: -45,
          formatter: function (value) {
            // Chỉ lấy tháng và ngày từ chuỗi ngày tháng
            return value.split(' ').slice(1, 3).join(' ');
          }
        }
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return value.toFixed(2); // Làm tròn giá trị không có chấm thập phân
          }
        }
      }
    }, false, true);
  });
});