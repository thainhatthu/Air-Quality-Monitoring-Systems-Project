// #CHART 1 
import { getAnalysis } from './firebaseConfig.js';
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
    // const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()); 
    // const startDate = new Date(endDate.getTime() - (24 * 60 * 60 * 1000)); 

    // Tạo mảng chứa timestamp cho mỗi giờ trong 24 giờ trước đó
    const timestamps = Object.keys(data);
    const seriesData = Object.values(data);
    const pm25 = seriesData.map(item => item.dust);
    const mq135 = seriesData.map(item => item.ppm);
    // for (let hour = startDate.getTime(); hour <= endDate.getTime(); hour += (60 * 60 * 1000)) {
    //   timestamps.push(hour);
    // }

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
        // min: startDate.getTime(),
        // max: endDate.getTime(),
        min: 0,
        max: 23,
        labels: {
          rotate: -45,
          formatter: function (value) {
            // const date = new Date(timestamp);
            // const formattedDate = `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`;
            // return formattedDate;
            return `${value}h`;
          }
        }
      }
    }, false, true);
  });

  // OPTION 7 DAYS AGO 
  document.getElementById('chart1_7days').addEventListener('click', () => {
    // Thực hiện thay đổi trục hoành để hiển thị dữ liệu trong 7 ngày gần nhất
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 6);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);

    const days = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayOfMonth = d.getDate();
      const month = d.toLocaleString('default', { month: 'short' }); // Lấy tên của tháng
      const formattedDate = `${dayOfMonth} ${month}`;
      days.push(formattedDate); // Thêm vào mảng
    }

    chart.updateOptions({
      xaxis: {
        type: 'categories',
        categories: days,
        labels: {
          rotate: -45,
          formatter: function (value, timestamp, index) {
            return value;
          }
        },
        tickAmount: 7 // Số lượng ngày hiển thị trên trục hoành
      }
    }, false, true);
  });

  //OPTION 30 DAYS AGO 
  document.getElementById('chart1_30days').addEventListener('click', () => {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 29);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);

    const days = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayOfMonth = d.getDate();
      const month = d.toLocaleString('default', { month: 'short' }); // Lấy tên của tháng
      const formattedDate = `${dayOfMonth} ${month}`; // Kết hợp ngày và tháng
      days.push(formattedDate); // Thêm vào mảng
    }

    chart.updateOptions({
      xaxis: {
        type: 'categories',
        categories: days,
        labels: {
          rotate: -45,
          formatter: function (value, timestamp, index) {
            return value; // Hiển thị tên của mỗi ngày
          }
        },
        tickAmount: 30
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

  document.getElementById('chart2_24h').addEventListener('click', () => {
    const currentDate = new Date();
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const startDate = new Date(endDate.getTime() - (24 * 60 * 60 * 1000));

    const timestamps = [];
    for (let hour = startDate.getTime(); hour <= endDate.getTime(); hour += (60 * 60 * 1000)) {
      timestamps.push(hour);
    }

    chart.updateOptions({
      xaxis: {
        type: 'datetime',
        categories: timestamps,
        min: startDate.getTime(),
        max: endDate.getTime(),
        labels: {
          rotate: -45,
          formatter: function (value, timestamp, index) {
            const date = new Date(timestamp);
            const formattedDate = `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`;
            return formattedDate;
          }
        }
      }
    }, false, true);
  });

  document.getElementById('chart2_7days').addEventListener('click', () => {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 6);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);

    const days = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayOfMonth = d.getDate();
      const month = d.toLocaleString('default', { month: 'short' });
      const formattedDate = `${dayOfMonth} ${month}`;
      days.push(formattedDate);
    }

    chart.updateOptions({
      xaxis: {
        type: 'categories',
        categories: days,
        labels: {
          rotate: -45,
          formatter: function (value, timestamp, index) {
            return value;
          }
        },
        tickAmount: 7
      }
    }, false, true);
  });

  document.getElementById('chart2_30days').addEventListener('click', () => {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 29);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);

    const days = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayOfMonth = d.getDate();
      const month = d.toLocaleString('default', { month: 'short' });
      const formattedDate = `${dayOfMonth} ${month}`;
      days.push(formattedDate);
    }

    chart.updateOptions({
      xaxis: {
        type: 'categories',
        categories: days,
        labels: {
          rotate: -45,
          formatter: function (value, timestamp, index) {
            return value;
          }
        },
        tickAmount: 30
      }
    }, false, true);
  });
});