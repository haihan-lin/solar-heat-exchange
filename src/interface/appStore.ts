import { makeAutoObservable } from "mobx";
import { createContext } from "react";

export class AppStore {
  minDate: Date;
  maxDate: Date;
  currentHoveredDateString: string | undefined;
  currentSelectedDate: Date | undefined;
  currentHoveredTimeStamp: Date | undefined;
  constructor() {
    this.minDate = new Date();
    this.maxDate = new Date();
    makeAutoObservable(this);
  }

  updateCurrentHoveredTimeStamp(newTimeStamp: Date | undefined) {
    this.currentHoveredTimeStamp = newTimeStamp;
  }

  updateCurrentHoveredDate(newDate: string | undefined) {
    this.currentHoveredDateString = newDate;
  }

  updateSelectedDate(newDate: Date | undefined) {

    this.currentSelectedDate = newDate;
    this.currentHoveredTimeStamp = undefined;
  }

  updateDates(newMinDate: Date | undefined, newMaxDate: Date | undefined) {
    if (newMinDate) {
      this.minDate = newMinDate;
    } if (newMaxDate) {
      this.maxDate = newMaxDate;
    }
    this.currentSelectedDate = this.minDate;
  }



}

const Store = createContext(new AppStore());
export default Store;
