import Plot from "react-plotly.js";
import type * as PlotlyType from "plotly.js";
import { useEffect, useState } from "react";
import React from "react";
import "../../../style/style.scss";
import Plotly from 'plotly.js/dist/plotly';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FaArrowLeft, FaArrowRight, FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface CustomZoomButtonProps {
  onClick: () => void;
}

export type IProps = {
  data: PlotlyType.Data[];
  onSelected: (event: PlotlyType.PlotSelectionEvent) => void;
}

export default function EMGPlot({
  data,
  onSelected,
}: IProps) {

  const [width, setWidth] = useState(2000);
  const responsiveChartRef = React.useRef<HTMLDivElement>(null);

  const [dragmode, setDragMode] = useState<PlotlyType.Layout["dragmode"]>("select");

  //const [xRange, setXRange] = useState<[number, number]>([0, 2]);
  const [xRange, setXRange] = useState<[number, number]>([0, 200]);
  const [yRange, setYRange] = useState<[number, number]>([-2000, 2000]);


  const keyHandleMovement = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault()
        setYRange([yRange[0] + (yRange[1] - yRange[0]) / 20, yRange[1] + (yRange[1] - yRange[0]) / 20]); // Di chuyển trục y lên
        break;
      case 'ArrowDown':
        event.preventDefault()
        setYRange([yRange[0] - (yRange[1] - yRange[0]) / 20, yRange[1] - (yRange[1] - yRange[0]) / 20]); // Di chuyển trục y xuống
        break;
      case 'ArrowLeft':
        setXRange([xRange[0] - (xRange[1] - xRange[0]) / 40, xRange[1] - (xRange[1] - xRange[0]) / 40]); // Di chuyển trục x sang trái
        break;
      case 'ArrowRight':
        setXRange([xRange[0] + (xRange[1] - xRange[0]) / 40, xRange[1] + (xRange[1] - xRange[0]) / 40]); // Di chuyển trục x sang phải
        break;
      default:
        return;
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', keyHandleMovement);
    return () => {
      window.removeEventListener('keydown', keyHandleMovement);
    };
  }, [xRange, yRange])

  useEffect(() => {
    const resize = () => {
      const elREF = responsiveChartRef.current;
      if (!elREF) return;
      setWidth(elREF.getBoundingClientRect().width);
    };
    window.addEventListener('resize', resize);
    resize();
  }, []);


  const [tickSpacing, setTickSpacing] = useState(0.1);

  const generateXTicks = (min: number, max: number) => {
    const tickSpacing = (max - min) / 20;
    const ticks = [];
    for (let i = min; i <= max; i += tickSpacing) {
      ticks.push(parseFloat(i.toFixed(3))); // Làm tròn đến 2 chữ số thập phân
    }
    return ticks;
  };

  // Sử dụng hàm generateXTicks để tạo ticks
  const [ticks, setTicks] = useState<number[]>([]);

  useEffect(() => {
    const maxTicks = 2000; // Giới hạn tối đa cho số lượng ticks
    const newTicks = generateXTicks(xRange[0], xRange[1]);

    // Nếu số lượng ticks vượt quá maxTicks, chỉ lấy maxTicks
    if (newTicks.length > maxTicks) {
      setTicks(newTicks.slice(0, maxTicks));
    } else {
      setTicks(newTicks);
    }
  }, [xRange, tickSpacing]);

  const handleZoomInX = () => {
    const zoomFactor = 0.5; // Adjust zoom factor as needed
    setXRange((prevXRange) => {
      const currentRangeMin = prevXRange[0];
      const currentRangeMax = prevXRange[1];

      const midPoint = (currentRangeMin + currentRangeMax) / 2;
      const newXRangeMin = midPoint - (midPoint - currentRangeMin) * zoomFactor;
      const newXRangeMax = midPoint + (currentRangeMax - midPoint) * zoomFactor;

      return [Math.max(0, newXRangeMin), newXRangeMax];
    });

    setTickSpacing((prevTickSpacing) => {
      const newTickSpacing = prevTickSpacing - 0.05;
      return newTickSpacing >= 1 ? 1 : newTickSpacing;
    });
  };

  const handleZoomOutX = () => {
    const zoomFactor = 2; // Adjust zoom factor as needed
    setXRange((prevXRange) => {
      const currentRangeMin = prevXRange[0];
      const currentRangeMax = prevXRange[1];

      const midPoint = (currentRangeMin + currentRangeMax) / 2;
      const newXRangeMin = midPoint - (midPoint - currentRangeMin) * zoomFactor;
      const newXRangeMax = midPoint + (currentRangeMax - midPoint) * zoomFactor;

      return [Math.max(0, newXRangeMin), newXRangeMax];
    });

    setTickSpacing((prevTickSpacing) => {
      const newTickSpacing = prevTickSpacing + 0.1; // Tăng 0.05 mỗi lần nhấn
      return newTickSpacing; // Đảm bảo không vượt quá 1
    });
  };

  const handleZoomInY = () => {
    const zoomFactor = 0.5; // Adjust zoom factor as needed
    setYRange((prevYRange) => {
      const currentRangeMin = prevYRange[0];
      const currentRangeMax = prevYRange[1];

      const midPoint = (currentRangeMin + currentRangeMax) / 2;
      const newYRangeMin = midPoint - (midPoint - currentRangeMin) * zoomFactor;
      const newYRangeMax = midPoint + (currentRangeMax - midPoint) * zoomFactor;

      return [newYRangeMin, newYRangeMax];
    });
  };

  const handleZoomOutY = () => {
    const zoomFactor = 2; // Adjust zoom factor as needed
    setYRange((prevYRange) => {
      const currentRangeMin = prevYRange[0];
      const currentRangeMax = prevYRange[1];

      const midPoint = (currentRangeMin + currentRangeMax) / 2;
      const newYRangeMin = midPoint - (midPoint - currentRangeMin) * zoomFactor;
      const newYRangeMax = midPoint + (currentRangeMax - midPoint) * zoomFactor;

      return [newYRangeMin, newYRangeMax];
    });
  };


  // const handleRelayout = (event: any) => {
  //   if (event['xaxis.range[0]'] && event['xaxis.range[1]']) {
  //     const newMin = event['xaxis.range[0]'];
  //     const newMax = event['xaxis.range[1]'];
  //     setXRange([newMin, newMax]); // Cập nhật xRange mới khi zoom
  //   }
  // };

  //const initialTicks = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2]
  //const initialTicks = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000]
  const initialTicks = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200]

  const handleResetScale = () => {
    setXRange([0, 200])
    setYRange([-2000, 2000])
    setTicks(initialTicks);
    setTickSpacing(0.1)
  };

  const handleSliderChange = (value: number | number[]) => {
    const newValue = Array.isArray(value) ? value[0] : value; // Lấy giá trị đầu tiên nếu là mảng
    const newXRange = [newValue, newValue + 200]; // Đặt độ rộng của khoảng hiển thị là 1
    setXRange(newXRange);
  };


  const CustomZoomButton: React.FC = () => {
    return (
      <div className="flex">
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center">
            {/* Nút Zoom In Y-Axis */}
            <div className="relative group mb-1">
              <button
                onClick={handleZoomInY}
                className="p-0 bg-transparent rounded-none hover:bg-transparent focus:outline-none"
              >
                <FaArrowUp />
              </button>
              <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-1 hidden group-hover:block text-white bg-black text-xs rounded py-1 px-1">
                Zoom In Y-Axis
              </span>
            </div>

            {/* Nút Zoom Out Y-Axis */}

            <div className="flex">
              {/* Nút Zoom In X-Axis */}
              <div className="relative group mr-1">
                <button
                  onClick={handleZoomInX}
                  className="p-0 bg-transparent rounded-none hover:bg-transparent focus:outline-none"
                >
                  <FaArrowLeft />
                </button>
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-1 hidden group-hover:block text-white bg-black text-xs rounded py-1 px-1">
                  Zoom In X-Axis
                </span>
              </div>

              {/* Nút Zoom Out X-Axis */}
              <div className="relative group">
                <button
                  onClick={handleZoomOutX}
                  className="p-0 bg-transparent rounded-none hover:bg-transparent focus:outline-none ml-5"
                >
                  <FaArrowRight />
                </button>
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-1 hidden group-hover:block text-white bg-black text-xs rounded py-1 px-1">
                  Zoom Out X-Axis
                </span>
              </div>
            </div>
            <div className="relative group mb-1">
              <button
                onClick={handleZoomOutY}
                className="p-0 bg-transparent rounded-none hover:bg-transparent focus:outline-none"
              >
                <FaArrowDown />
              </button>
              <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-1 hidden group-hover:block text-white bg-black text-xs rounded py-1 px-1">
                Zoom Out Y-Axis
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="flex flex-col items-center mb-10">
      <div ref={responsiveChartRef} className="w-full relative"> {/* Thêm relative để làm bối cảnh cho absolute */}
        <Plot
          onSelected={onSelected}
          onRedraw={() => console.log('redraw')}
          onButtonClicked={e => console.log(e)}
          onPurge={() => console.log('purge')}
          onAutoSize={() => console.log('autosize')}
          onClickAnnotation={e => console.log(e)}
          onUpdate={e => {
            if (
              dragmode != e.layout.dragmode &&
              e.layout.dragmode != undefined &&
              e.layout.dragmode == 'select'
            ) {
              setDragMode(e.layout.dragmode);
            }
          }}
          divId='plotly-div'
          debug={true}
          data={data}
          layout={{
            width: 800,
            height: 600,
            title: 'EMG',
            showlegend: false,
            dragmode: dragmode,
            yaxis: {
              title: 'Điện thế (mV)',
              showline: true,
              range: yRange,
            },
            xaxis: {
              title: 'Thời gian (ms)',
              zeroline: false,
              showline: true,
              range: xRange,
              tickvals: ticks
            },
            uirevision: 'true',
          }}
          config={{
            displaylogo: false,
            displayModeBar: true,
            modeBarButtons: [
              ['zoom2d'],
              ['pan2d'],
              ['select2d'],
              // [
              //   {
              //     name: 'Zoom Out X-Axis', // Custom button name
              //     title: 'Zoom Out X-Axis',
              //     icon: Plotly.Icons.zoombox, // Use any available Plotly icon
              //     click: handleZoomOutX
              //   },
              // ],
              // [
              //   {
              //     name: 'Zoom In Y-Axis', // Custom button name
              //     title: 'Zoom In Y-Axis',
              //     icon: Plotly.Icons.zoombox, // Use any available Plotly icon
              //     click: handleZoomInY
              //   },
              // ],
              // [
              //   {
              //     name: 'Zoom Out Y-Axis', // Custom button name
              //     title: 'Zoom Out Y-Axis',
              //     icon: Plotly.Icons.zoombox, // Use any available Plotly icon
              //     click: handleZoomOutY
              //   },
              // ],
              [
                {
                  name: 'resetScale',
                  title: 'Reset Scale',
                  icon: Plotly.Icons.autoscale,
                  click: handleResetScale,
                }
              ],
            ],
          }}
        />
        {/* Chồng lên Plot */}
        <div className="absolute top-2 right-2 z-50">
          <CustomZoomButton />
        </div>
      </div>

      <div className="w-full mt-4">
        {/* <Slider
          min={0}
          max={20}
          step={0.1}
          value={xRange[0]}
          onChange={handleSliderChange}
          className="w-2/3 mx-8"
        /> */}
        <Slider
          min={0}
          max={20000}
          step={10}
          value={xRange[0]}
          onChange={handleSliderChange}
          className="w-2/3 mx-8"
        />
      </div>
    </div>

  );
}
