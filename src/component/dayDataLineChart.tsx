import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import Store from "../interface/appStore";
import { observer } from "mobx-react-lite";
import { margin, SVGHeight, SVGWidth } from "../preset/constants";
import { time } from "console";
import { scaleLinear, scaleTime } from "d3-scale";
import { extent } from "d3-array";
import { select } from "d3-selection";
import { axisBottom, axisLeft } from "d3-axis";
import { timeFormat } from "d3-time-format";
import { transition } from "d3-transition";
import { curveBumpX, curveCardinal, line } from "d3-shape";
import { set } from "mobx";
import { LineColor } from "../preset/colors";
import { format } from "d3-format";
import { grey, purple } from "@mui/material/colors";

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

  const xScale = useCallback(() => {
    return scaleTime().domain(extent(timeStampToVisualize) as [Date, Date]).range([margin.left, SVGWidth - margin.right]);
  }, [timeStampToVisualize]);

  const yScale = useCallback(() => {
    return scaleLinear().domain([
      yScaleWithMinMax ?
        0.9 * Math.min(...dataToVisualize) : 0, 1.1 * Math.max(...dataToVisualize)]).range([SVGHeight - margin.bottom, margin.top]).nice();
  }, [dataToVisualize, yScaleWithMinMax]);


  useEffect(() => {
    if (dataToVisualize.length === 0 || timeStampToVisualize.length === 0) return;

    const svg = select(svgRef.current);

    if (timeStampToVisualize.length === 0 || dataToVisualize.length === 0) return;

    const xAxis = axisBottom(xScale());
    const formatDate = timeFormat("%H:%M");
    xAxis.tickFormat((d: any) => formatDate(d as Date));

    var t = transition()
      .duration(500);

    xAxisG.transition(t)
      .call(xAxis);

    yAxisG.transition(t)
      .call(
        axisLeft(yScale())
      );

    const lineFunction = line()
      .x((d, i) => xScale()(timeStampToVisualize[i]))
      .y((d: any) => yScale()(d));
    lineFunction.curve(curveCardinal);

    svg.select('path')
      .attr('fill', 'none')
      .attr('stroke-width', 1.5)
      .transition(t)
      .attr('d', lineFunction(dataToVisualize as any));

    const hoverRect = svg.select('#hover');
    hoverRect.on('mousemove', e => {
      const x = e.offsetX;
      const dateAtX = xScale().invert(x);
      const closestIndex = timeStampToVisualize.reduce((prevIdx, curr, currIdx) => {
        const prevDiff = Math.abs(timeStampToVisualize[prevIdx].getTime() - dateAtX.getTime());
        const currDiff = Math.abs(curr.getTime() - dateAtX.getTime());
        return currDiff < prevDiff ? currIdx : prevIdx;
      }, 0);
      const closestTimeStamp = timeStampToVisualize[closestIndex];
      store.updateCurrentHoveredTimeStamp(closestTimeStamp);
    }
    ).on('mouseleave', () => {
      store.updateCurrentHoveredTimeStamp(undefined);
    }
    );

  }, [dataToVisualize, timeStampToVisualize, xScale, yScale]);

  function findValueAtTimeStamp(timeStamp: Date | undefined): number {
    if (!timeStamp) {
      return 0;
    }
    const i = timeStampToVisualize.findIndex(t => t.getTime() === timeStamp.getTime());
    if (i >= 0) {
      return dataToVisualize[i];

    }
    return 0;

  }



  return (
    <svg ref={svgRef}
      style={{ border: grey[500], borderStyle: 'double' }}

      width={SVGWidth}
      height={SVGHeight}
    >
      <rect x={margin.left} width={SVGWidth - margin.left - margin.right} height="100%" fill="white" id='hover' />

      <path stroke={LineColor} />

      <text x={margin.left + 5} y={margin.top} textAnchor="start" alignmentBaseline="hanging" fill={LineColor} fontSize="10">
        {yAxisTitle}
      </text>

      <text id='tooltip' x={margin.left + 5} y={margin.top + 12} visibility={store.currentHoveredTimeStamp ? 'visible' : 'hidden'} textAnchor="start" alignmentBaseline="hanging" fill={LineColor} fontSize="10">
        {`${store.currentHoveredTimeStamp ? timeFormat("%H:%M")(store.currentHoveredTimeStamp) : ''}, ${(findValueAtTimeStamp(store.currentHoveredTimeStamp))}`}
      </text>

      <circle
        r={4}
        cx={xScale()(store.currentHoveredTimeStamp || new Date())}
        cy={yScale()(findValueAtTimeStamp(store.currentHoveredTimeStamp))}
        fill={purple[500]}
        id="hover-circle"
        visibility={store.currentHoveredTimeStamp ? 'visible' : 'hidden'} />

    </svg>
  );
};

export default observer(DayDataLineChart);
