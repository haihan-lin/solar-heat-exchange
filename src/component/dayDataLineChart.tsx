import { FC, useContext, useEffect, useRef, useState } from "react";
import Store from "../interface/appStore";
import { observer } from "mobx-react-lite";
import { margin, SVGHeight, SVGWidth } from "../constants";
import { time } from "console";
import { scaleLinear, scaleTime } from "d3-scale";
import { extent } from "d3-array";
import { select } from "d3-selection";
import { axisBottom, axisLeft } from "d3-axis";
import { timeFormat } from "d3-time-format";
import { transition } from "d3-transition";
import { line } from "d3-shape";
import { set } from "mobx";

type Props = {
  allDataOfType: number[],
  timeStamps: Date[];
  yScaleWithMinMax?: boolean;
  yAxisTitle: string;
};

const DayDataLineChart: FC<Props> = ({ allDataOfType, timeStamps, yScaleWithMinMax, yAxisTitle }: Props) => {
  const store = useContext(Store);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [dataToVisualize, setDataToVisualize] = useState<number[]>([]);
  const [timeStampToVisualize, setTimeStampsToVisualize] = useState<Date[]>([]);

  useEffect(() => {
    const timeStampsForSelectedDate: Date[] = [];
    const filteredData = allDataOfType.filter((v, i) => {
      const date = timeStamps[i];
      const dateStr = date.toLocaleDateString();
      console.log(date, dateStr);
      if (store.currentSelectedDate) {
        if (dateStr === store.currentSelectedDate.toLocaleDateString()) {
          timeStampsForSelectedDate.push(date);
          return true;
        }
      }
      return false;
    });
    setDataToVisualize(filteredData);
    setTimeStampsToVisualize(timeStampsForSelectedDate);

  }, [store.currentSelectedDate, allDataOfType, timeStamps]);

  const [xAxisG, setXAxisG] = useState<any>(null);
  const [yAxisG, setYAxisG] = useState<any>(null);
  useEffect(() => {
    if (svgRef.current) {
      const svg = select(svgRef.current);
      const x = svg.append('g').attr('id', 'x-axis').attr('transform', `translate(0,${SVGHeight - margin.bottom})`);;
      const y = svg.append('g').attr('id', 'y-axis').attr('transform', `translate(${margin.left},0)`);
      setXAxisG(x);
      setYAxisG(y);
    }
  }, []);



  useEffect(() => {
    if (dataToVisualize.length === 0 || timeStampToVisualize.length === 0) return;

    const svg = select(svgRef.current);

    if (timeStampToVisualize.length === 0 || dataToVisualize.length === 0) return;

    const xScale = scaleTime().domain(extent(timeStampToVisualize) as [Date, Date]).range([margin.left, SVGWidth - margin.right]);

    const yScale = scaleLinear().domain([
      yScaleWithMinMax ?
        Math.min(...dataToVisualize) : 0, Math.max(...dataToVisualize)]).range([SVGHeight - margin.bottom, margin.top]).nice();


    const xAxis = axisBottom(xScale);
    const formatDate = timeFormat("%H:%M");
    xAxis.tickFormat((d: any) => formatDate(d as Date));



    var t = transition()
      .duration(500);


    xAxisG.transition(t)
      .call(xAxis);


    yAxisG.transition(t)
      .call(
        axisLeft(yScale)
      );

    const lineFunction = line()
      .x((d, i) => xScale(timeStampToVisualize[i]))
      .y((d: any) => yScale(d));

    svg.select('path')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .transition(t)
      .attr('d', lineFunction(dataToVisualize as any));

  }, [dataToVisualize, timeStampToVisualize,]);

  return (
    <svg ref={svgRef}
      width={SVGWidth}
      height={SVGHeight}
    >
      <path />

      <text x={margin.left + 5} y={margin.top} textAnchor="start" alignmentBaseline="hanging" fill="darkblue" fontSize="10">
        {yAxisTitle}
      </text>

    </svg>
  );
};

export default observer(DayDataLineChart);
