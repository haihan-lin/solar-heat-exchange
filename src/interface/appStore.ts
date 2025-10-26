import { makeAutoObservable } from "mobx";
import { createContext } from "react";

export class AppStore {
  minDate: Date;
  maxDate: Date;
  currentSelectedDate: Date | undefined;
  constructor() {
    this.minDate = new Date();
    this.maxDate = new Date();
    makeAutoObservable(this);
    this.currentSelectedDate = undefined;

  }

  updateSelectedDate(newDate: Date | undefined) {
    // console.log('updating selected date to:', newDate?.toISOString().slice(0, 10));
    this.currentSelectedDate = newDate;
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
