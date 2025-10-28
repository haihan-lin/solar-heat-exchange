import { FC, use, useCallback, useContext, useEffect, useRef, useState } from "react";
import Store from "../interface/appStore";
import { select } from "d3-selection";
import { scaleLinear, scaleTime, scaleUtc } from "d3-scale";
import { observer } from "mobx-react-lite";
import { axisBottom, axisLeft } from "d3-axis";
import { curveCardinal, line } from "d3-shape";
import { mean } from 'd3-array';
import { timeFormat } from "d3-time-format";
import { format } from "d3-format";
import { margin, SVGHeight, SVGWidth } from "../preset/constants";
import { LineColor } from "../preset/colors";
import { grey, purple } from "@mui/material/colors";

type Props = {
  arrayOfDataVisualized: number[],
  dateOnlyTimeStamps: Date[];
  yScaleWithMinMax?: boolean;
  yAxisTitle: string;
};

// take in timestamp and values, make a daily average line chart

const OverallLineChart: FC<Props> = ({ arrayOfDataVisualized, dateOnlyTimeStamps, yScaleWithMinMax, yAxisTitle }: Props) => {
  const store = useContext(Store);


  const [dayToValuesMap, setDayToValuesMap] = useState<{ [key: string]: number[]; }>({});



  useEffect(() => {
    // process data into daily average
    const dailyValues: { [key: string]: number[]; } = {};

    dateOnlyTimeStamps.forEach((date, i) => {
      const formattedDate = date.toLocaleDateString();
      if (dailyValues[formattedDate]) {
        dailyValues[formattedDate].push(arrayOfDataVisualized[i]);
      } else {
        dailyValues[formattedDate] = [arrayOfDataVisualized[i]];
      }
    });

    setDayToValuesMap(dailyValues);

  }, [arrayOfDataVisualized, dateOnlyTimeStamps]);



  const xScale = useCallback(() => {
    return scaleTime()
      .domain([store.minDate, store.maxDate])
      .range([margin.left, SVGWidth - margin.right]);
  }, [store.minDate, store.maxDate]);

  const yScale = useCallback(() => {
    return scaleLinear()
      .domain([yScaleWithMinMax ? Math.min(...arrayOfDataVisualized) : 0, Math.max(...arrayOfDataVisualized)])
      .range([SVGHeight - margin.bottom, margin.top]);
  }, [arrayOfDataVisualized, yScaleWithMinMax]);



  const svgRef = useRef(null);

  useEffect(() => {
    if (arrayOfDataVisualized.length === 0 || dateOnlyTimeStamps.length === 0) return;

    const svg = select(svgRef.current);

    // Clear previous elements
    svg.selectAll('g').remove();
    svg.selectAll('path').remove();


    const xAxis = axisBottom(xScale());
    const formatDate = timeFormat("%m-%d");
    xAxis.tickFormat((d: any) => formatDate(d as Date));

    // Add X-axis
    svg.append('g')
      .attr('transform', `translate(0,${SVGHeight - margin.bottom})`)
      .call(xAxis);

    // Add Y-axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(axisLeft(yScale()));

    // Create the line generator
    const lineFunction = line()
      .x((d: any) => xScale()(new Date(d)))
      .y((d: any) => yScale()(mean(dayToValuesMap[d] ?? []) ?? 0));
    // lineFunction.curve(curveCardinal);

    svg.append('path')
      .attr('fill', 'none')
      .attr('stroke', LineColor)
      .attr('stroke-width', 1.5)
      .attr('d', lineFunction(Object.keys(dayToValuesMap) as any));

    const hoverRect = svg.select('#hover');
    hoverRect.on('mousemove', e => {
      const x = e.offsetX;
      const dateAtX = xScale().invert(x).toLocaleDateString();
      store.updateCurrentHoveredDate(dateAtX);
    }
    ).on('mouseleave', () => {
      store.updateCurrentHoveredDate(undefined);
    }
    );

  }, [xScale, yScale, dayToValuesMap, arrayOfDataVisualized.length, dateOnlyTimeStamps.length]);

  const [hoveredDataValue, setHoveredDataValue] = useState<number>(0);

  useEffect(() => {
    if (store.currentHoveredDateString) {
      const values = dayToValuesMap[store.currentHoveredDateString];
      if (values && values.length > 0) {
        const avg = mean(values);
        setHoveredDataValue(avg ?? 0);
      } else {
        setHoveredDataValue(0);
      }
    } else {
      setHoveredDataValue(0);
    }
  }, [store.currentHoveredDateString, dayToValuesMap]);

  return (
    <svg ref={svgRef}
      width={SVGWidth}
      height={SVGHeight}
      style={{ border: grey[500], borderStyle: 'double' }}

    >
      <rect x={margin.left} width={SVGWidth - margin.left - margin.right} height="100%" fill="white" id='hover' />
      <text x={margin.left + 5} y={margin.top} textAnchor="start" alignmentBaseline="hanging" fill={LineColor} fontSize="10">
        {yAxisTitle} Daily Average
      </text>
      <text id='tooltip' x={margin.left + 5} y={margin.top + 12} visibility={store.currentHoveredDateString ? 'visible' : 'hidden'} textAnchor="start" alignmentBaseline="hanging" fill={LineColor} fontSize="10">
        {`${store.currentHoveredDateString ?? ''}, ${format(".2f")(hoveredDataValue)}`}
      </text>

      <circle
        r={4}
        cx={xScale()(new Date(store.currentHoveredDateString || ''))}
        cy={yScale()(hoveredDataValue)}
        fill={purple[500]}
        id="hover-circle"
        visibility={store.currentHoveredDateString ? 'visible' : 'hidden'} />
    </svg>
  );
};

export default observer(OverallLineChart);
