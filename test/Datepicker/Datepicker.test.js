import Datepicker from '@/components/Datepicker.vue'
import DateInput from '@/components/DateInput.vue'
import { nextTick } from 'vue'
import { shallowMount, mount } from '@vue/test-utils'

describe('Datepicker unmounted', () => {
  it('has a mounted hook', () => {
    expect(typeof Datepicker.mounted).toEqual('function')
  })

  it('sets the correct default data', () => {
    expect(typeof Datepicker.data).toEqual('function')
    const defaultData = Datepicker.data()
    expect(defaultData.selectedDate).toEqual(null)
    expect(defaultData.showDayView).toEqual(false)
    expect(defaultData.showMonthView).toEqual(false)
    expect(defaultData.showYearView).toEqual(false)
    expect(defaultData.calendarHeight).toEqual(0)
  })
})

describe('Datepicker mounted', () => {
  let wrapper
  let date
  beforeEach(() => {
    date = new Date(2016, 1, 15)
    wrapper = shallowMount(Datepicker, {
      props: {
        format: 'yyyy-MM-dd',
        value: date
      }
    })
  })

  it('correctly sets the value when created', () => {
    expect(wrapper.vm.value).toEqual(date)
  })

  it('correctly sets the value from method', () => {
    const newDate = new Date(2016, 9, 15)
    expect(typeof wrapper.vm.setValue).toEqual('function')
    wrapper.vm.setValue(newDate)
    expect(wrapper.vm.selectedDate).toEqual(newDate)
    const now = new Date()
    wrapper.vm.setValue()
    expect(wrapper.vm.selectedDate).toEqual(null)
    const pageDate = new Date(wrapper.vm.pageDate)
    expect(pageDate.getFullYear()).toEqual(now.getFullYear())
    expect(pageDate.getMonth()).toEqual(now.getMonth())
    expect(pageDate.getDate()).toEqual(1)
  })

  it('sets the date', () => {
    const date = new Date(2016, 9, 9)
    const wrapper = shallowMount(Datepicker, {
      props: {
        format: 'yyyy-MM-dd'
      }
    })
    wrapper.vm.setDate(date.getTime())
    expect(wrapper.vm.selectedDate.getTime()).toEqual(date.getTime())
  })

  it('clears the date', () => {
    const date = new Date(2016, 9, 9)
    const wrapper = shallowMount(Datepicker)
    wrapper.vm.setDate(date.getTime())
    wrapper.vm.clearDate()
    expect(wrapper.vm.selectedDate).toEqual(null)
  })

  it('should set pageTimestamp to be now', () => {
    const data = Datepicker.data()
    const d = new Date(data.pageTimestamp)
    expect(d.getFullYear()).toEqual(new Date().getFullYear())
    expect(d.getMonth()).toEqual(new Date().getMonth())
    expect(d.getDate()).toEqual(1)
  })

  it('should open and close the calendar', () => {
    wrapper.vm.close()
    expect(wrapper.vm.isOpen).toEqual(false)

    wrapper.vm.showMonthCalendar()
    expect(wrapper.vm.isOpen).toEqual(true)

    wrapper.vm.close()
    expect(wrapper.vm.isOpen).toEqual(false)

    wrapper.vm.showYearCalendar()
    expect(wrapper.vm.isOpen).toEqual(true)

    wrapper.vm.close()
    expect(wrapper.vm.isOpen).toEqual(false)

    wrapper.vm.showDayCalendar()
    expect(wrapper.vm.isOpen).toEqual(true)
    // calendar is already open so acts as a toggle
    wrapper.vm.showCalendar()
    expect(wrapper.vm.isOpen).toEqual(false)
  })

  it('should emit selectedDisabled on a disabled timestamp', () => {
    const date = new Date(2016, 9, 1)
    wrapper.vm.selectDisabledDate({ timestamp: date.getTime() })
    expect(wrapper.emitted().selectedDisabled).toBeTruthy()
  })

  it('can select a day', () => {
    const date = new Date(2016, 9, 1)
    wrapper.vm.selectDate({ timestamp: date.getTime() })
    expect(wrapper.vm.pageTimestamp).toEqual(date.getTime())
    expect(wrapper.vm.selectedDate.getMonth()).toEqual(9)
    expect(wrapper.vm.showDayView).toEqual(false)
    expect(wrapper.emitted().selected).toBeTruthy()
  })

  it('can select a month', () => {
    const date = new Date(2016, 9, 9)
    wrapper.vm.selectMonth({ timestamp: date.getTime() })
    expect(wrapper.emitted().changedMonth).toBeTruthy()
    expect(wrapper.emitted().changedMonth[0][0].timestamp).toEqual(date.getTime())
    expect(new Date(wrapper.vm.pageTimestamp).getMonth()).toEqual(date.getMonth())
    expect(wrapper.vm.showDayView).toEqual(true)
  })

  it('can select a year', () => {
    const date = new Date(2018, 9, 9)
    wrapper.vm.selectYear({ timestamp: date.getTime() })
    expect(wrapper.emitted().changedYear).toBeTruthy()
    expect(wrapper.emitted().changedYear[0][0].timestamp).toEqual(date.getTime())
    expect(new Date(wrapper.vm.pageTimestamp).getFullYear()).toEqual(date.getFullYear())
    expect(wrapper.vm.showMonthView).toEqual(true)
  })

  it('resets the default page date', () => {
    const wrapper = shallowMount(Datepicker)
    const today = new Date()
    expect(wrapper.vm.pageDate.getFullYear()).toEqual(today.getFullYear())
    expect(wrapper.vm.pageDate.getMonth()).toEqual(today.getMonth())
    expect(wrapper.vm.pageDate.getDate()).toEqual(1)
    wrapper.vm.resetDefaultPageDate()
    expect(wrapper.vm.pageDate.getFullYear()).toEqual(today.getFullYear())
    expect(wrapper.vm.pageDate.getMonth()).toEqual(today.getMonth())
    expect(wrapper.vm.pageDate.getDate()).toEqual(1)
  })

  it('does not set the default page date if a date is selected', () => {
    const wrapper = shallowMount(Datepicker)
    const today = new Date()
    const pastDate = new Date(2018, 3, 20)
    expect(wrapper.vm.pageDate.getFullYear()).toEqual(today.getFullYear())
    expect(wrapper.vm.pageDate.getMonth()).toEqual(today.getMonth())
    expect(wrapper.vm.pageDate.getDate()).toEqual(1)
    wrapper.vm.setDate(pastDate.getTime())
    wrapper.vm.resetDefaultPageDate()
    expect(wrapper.vm.pageDate.getFullYear()).toEqual(pastDate.getFullYear())
    expect(wrapper.vm.pageDate.getMonth()).toEqual(pastDate.getMonth())
    expect(wrapper.vm.pageDate.getDate()).toEqual(1)
  })

  it('sets the date on typedDate event', () => {
    const wrapper = shallowMount(Datepicker)
    const today = new Date()
    wrapper.vm.setTypedDate(today)
    expect(wrapper.vm.selectedDate).toEqual(today)
  })

  it('watches value', async () => {
    const wrapper = shallowMount(Datepicker, {
      props: {
        value: '2018-01-01'
      }
    })
    const spy = vi.spyOn(wrapper.vm, 'setValue')
    await wrapper.setProps({ value: '2018-04-26' })
    expect(spy).toBeCalled()
  })

  it('watches openDate', async () => {
    const wrapper = shallowMount(Datepicker, {
      props: {
        openDate: new Date(2018, 0, 1)
      }
    })
    const spy = vi.spyOn(wrapper.vm, 'setPageDate')
    await wrapper.setProps({ openDate: new Date(2018, 3, 26) })
    expect(spy).toBeCalled()
  })

  it('watches initialView', async () => {
    const wrapper = shallowMount(Datepicker, {
      props: {
        initialView: 'day'
      }
    })
    const spy = vi.spyOn(wrapper.vm, 'setInitialView')
    await wrapper.setProps({ initialView: 'month' })
    expect(spy).toBeCalled()
  })

  it('should emit changedMonth on a month change received from PickerDay', () => {
    const date = new Date(2016, 9, 1)
    wrapper.vm.handleChangedMonthFromDayPicker({ timestamp: date.getTime() })
    expect(wrapper.emitted().changedMonth).toBeTruthy()
  })
})

describe('Datepicker.vue set by string', () => {
  let wrapper
  it('can parse a string date', () => {
    wrapper = shallowMount(Datepicker, {
      props: {
        format: 'yyyy MM dd',
        value: '2016-02-20'
      }
    })
    const date = new Date('2016-02-20')
    expect(wrapper.vm.selectedDate.getFullYear()).toEqual(date.getFullYear())
    expect(wrapper.vm.selectedDate.getMonth()).toEqual(date.getMonth())
    expect(wrapper.vm.selectedDate.getDate()).toEqual(date.getDate())
  })

  it('should nullify malformed value', () => {
    wrapper = shallowMount(Datepicker, {
      props: {
        value: 'today'
      }
    })
    expect(wrapper.vm.selectedDate).toBeNull()
  })
})

describe('Datepicker.vue set by timestamp', () => {
  let wrapper
  it('can parse unix timestamp', () => {
    wrapper = shallowMount(Datepicker, {
      props: {
        format: 'yyyy MM dd',
        // https://github.com/charliekassel/vuejs-datepicker/commit/b2e9b37ad626bb0a65fd190dbd926671e347c7c0#diff-55b4db7abe80bcc349e3d6d4cd28bf5b8debca792b25d728c828a03e5d58c9fdL259
        value: 1517194697668
      }
    })

    expect(wrapper.vm.selectedDate.getFullYear()).toEqual(2018)
    expect(wrapper.vm.selectedDate.getMonth()).toEqual(0)
    expect(wrapper.vm.selectedDate.getDate()).toEqual(28)
  })
})

describe('Datepicker.vue using UTC', () => {
  let wrapper
  it('correctly sets the value using UTC', async () => {
    const timezoneOffset = ((new Date()).getTimezoneOffset() / 60)

    // this is ambiguous because localzone differs by one day than UTC
    const ambiguousHour = 25 - timezoneOffset
    const ambiguousDate = new Date(2018, 3, 15, ambiguousHour)
    const ambiguousYear = ambiguousDate.getUTCFullYear()
    const ambiguousMonth = (`0${ambiguousDate.getUTCMonth() + 1}`).slice(-2)
    const ambiguousDay = (`0${ambiguousDate.getUTCDate()}`).slice(-2)
    const UTCString = `${ambiguousYear} ${ambiguousMonth} ${ambiguousDay}`

    // It's important to use the `mount` helper here
    wrapper = mount(Datepicker, {
      props: {
        format: 'yyyy MM dd',
        value: ambiguousDate,
        useUtc: true // This should fail if `useUtc=false`
      }
    })
    // It's important to assert the input rendered output
    await nextTick()

    const dateInput = wrapper.findComponent(DateInput)
    expect(dateInput.exists()).toBe(true)
    expect(dateInput.vm.formattedValue).toEqual(UTCString)
  })
})

describe('Datepicker with initial-view', () => {
  let wrapper
  it('should open in Day view', () => {
    wrapper = shallowMount(Datepicker)
    wrapper.vm.showCalendar()
    expect(wrapper.vm.computedInitialView).toEqual('day')
    expect(wrapper.vm.showDayView).toEqual(true)
    expect(wrapper.vm.showMonthView).toEqual(false)
    expect(wrapper.vm.showYearView).toEqual(false)
  })

  it('should open in Month view', () => {
    wrapper = shallowMount(Datepicker, {
      props: {
        initialView: 'month'
      }
    })
    wrapper.vm.showCalendar()
    expect(wrapper.vm.computedInitialView).toEqual('month')
    expect(wrapper.vm.showDayView).toEqual(false)
    expect(wrapper.vm.showMonthView).toEqual(true)
    expect(wrapper.vm.showYearView).toEqual(false)
  })

  it('should open in Year view', () => {
    wrapper = shallowMount(Datepicker, {
      props: {
        initialView: 'year'
      }
    })
    wrapper.vm.showCalendar()
    expect(wrapper.vm.computedInitialView).toEqual('year')
    expect(wrapper.vm.showDayView).toEqual(false)
    expect(wrapper.vm.showMonthView).toEqual(false)
    expect(wrapper.vm.showYearView).toEqual(true)
  })
})
