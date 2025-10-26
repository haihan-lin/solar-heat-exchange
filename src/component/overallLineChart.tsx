import { FC, useContext, useEffect, useRef, useState } from "react";
import Store from "../interface/appStore";
import { select } from "d3-selection";
import { scaleLinear, scaleTime, scaleUtc } from "d3-scale";
import { observer } from "mobx-react-lite";
import { axisBottom, axisLeft } from "d3-axis";
import { line } from "d3-shape";
import { mean } from 'd3-array';
import { timeFormat } from "d3-time-format";
import { margin, SVGHeight, SVGWidth } from "../constants";

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

  // const [uniqueDates,setUniqueDates] = useState<

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





  const svgRef = useRef(null);

  useEffect(() => {
    if (arrayOfDataVisualized.length === 0 || dateOnlyTimeStamps.length === 0) return;

    const svg = select(svgRef.current);


    const xScale = scaleTime()
      .domain([store.minDate, store.maxDate])
      .range([margin.left, SVGWidth - margin.right]);



    const yScale = scaleLinear()
      .domain([yScaleWithMinMax ? Math.min(...arrayOfDataVisualized) : 0, Math.max(...arrayOfDataVisualized)])
      .range([SVGHeight - margin.bottom, margin.top]);

    // Clear previous elements
    svg.selectAll('g').remove();
    svg.selectAll('path').remove();


    const xAxis = axisBottom(xScale);
    const formatDate = timeFormat("%m-%d");
    xAxis.tickFormat((d: any) => formatDate(d as Date));

    // Add X-axis
    svg.append('g')
      .attr('transform', `translate(0,${SVGHeight - margin.bottom})`)
      .call(xAxis);

    // Add Y-axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(axisLeft(yScale));

    // Create the line generator
    const lineFunction = line()
      .x((d: any) => xScale(new Date(d)))
      .y((d: any) => yScale(mean(dayToValuesMap[d] ?? []) ?? 0));
    svg.append('path')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', lineFunction(Object.keys(dayToValuesMap) as any));

  }, [dayToValuesMap, store.minDate, store.maxDate, yScaleWithMinMax, dateOnlyTimeStamps.length, arrayOfDataVisualized]);

  return (
    <svg ref={svgRef}
      width={SVGWidth}
      height={SVGHeight}
    >
      <text x={margin.left + 5} y={margin.top} textAnchor="start" alignmentBaseline="hanging" fill="darkblue" fontSize="10">
        {yAxisTitle} Daily Average
      </text>
    </svg>
  );
};

export default observer(OverallLineChart);
