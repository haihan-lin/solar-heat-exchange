import { observer } from "mobx-react-lite";
import { FC, useContext } from "react";
import Store from "../interface/appStore";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import "./dateSelector.css";

const DateSelector: FC = () => {
  const store = useContext(Store);

  return (
    <div className="container">
      View data from
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          defaultValue={dayjs(store.minDate.toLocaleDateString())}
          minDate={dayjs(store.minDate.toLocaleDateString())}
          onChange={(newVal: any) => {
            const date = newVal && newVal['$d'] instanceof Date ? newVal['$d'] as Date : undefined;
            store.updateSelectedDate(date);
          }}
          maxDate={dayjs(store.maxDate.toLocaleDateString())}
        />
      </LocalizationProvider>
    </div>);
};
export default observer(DateSelector);
