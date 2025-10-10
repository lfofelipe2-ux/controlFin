/**
 * Complete dayjs mock for testing
 * 
 * This mock provides all the methods used by Ant Design DatePicker
 * and other components that depend on dayjs.
 */

import { vi } from 'vitest';

// Create a mock dayjs instance that can be chained
const createMockDayjs = (date?: Date | string | number) => {
    const mockDate = date ? new Date(date) : new Date('2024-01-01');

    return {
        // Basic methods
        format: vi.fn((format?: string) => {
            if (format) {
                return mockDate.toISOString().split('T')[0]; // Return YYYY-MM-DD by default
            }
            return mockDate.toISOString();
        }),
        toDate: vi.fn(() => mockDate),
        isValid: vi.fn(() => true),

        // Time methods
        hour: vi.fn(() => mockDate.getHours()),
        minute: vi.fn(() => mockDate.getMinutes()),
        second: vi.fn(() => mockDate.getSeconds()),
        millisecond: vi.fn(() => mockDate.getMilliseconds()),

        // Time manipulation
        setHour: vi.fn((hour: number) => {
            const newDate = new Date(mockDate);
            newDate.setHours(hour);
            return createMockDayjs(newDate);
        }),
        setMinute: vi.fn((minute: number) => {
            const newDate = new Date(mockDate);
            newDate.setMinutes(minute);
            return createMockDayjs(newDate);
        }),
        setSecond: vi.fn((second: number) => {
            const newDate = new Date(mockDate);
            newDate.setSeconds(second);
            return createMockDayjs(newDate);
        }),
        setMillisecond: vi.fn((millisecond: number) => {
            const newDate = new Date(mockDate);
            newDate.setMilliseconds(millisecond);
            return createMockDayjs(newDate);
        }),

        // Date manipulation
        add: vi.fn((amount: number, unit: string) => {
            const newDate = new Date(mockDate);
            switch (unit) {
                case 'day':
                case 'days':
                    newDate.setDate(newDate.getDate() + amount);
                    break;
                case 'month':
                case 'months':
                    newDate.setMonth(newDate.getMonth() + amount);
                    break;
                case 'year':
                case 'years':
                    newDate.setFullYear(newDate.getFullYear() + amount);
                    break;
                case 'hour':
                case 'hours':
                    newDate.setHours(newDate.getHours() + amount);
                    break;
                case 'minute':
                case 'minutes':
                    newDate.setMinutes(newDate.getMinutes() + amount);
                    break;
                case 'second':
                case 'seconds':
                    newDate.setSeconds(newDate.getSeconds() + amount);
                    break;
            }
            return createMockDayjs(newDate);
        }),

        subtract: vi.fn((amount: number, unit: string) => {
            const newDate = new Date(mockDate);
            switch (unit) {
                case 'day':
                case 'days':
                    newDate.setDate(newDate.getDate() - amount);
                    break;
                case 'month':
                case 'months':
                    newDate.setMonth(newDate.getMonth() - amount);
                    break;
                case 'year':
                case 'years':
                    newDate.setFullYear(newDate.getFullYear() - amount);
                    break;
                case 'hour':
                case 'hours':
                    newDate.setHours(newDate.getHours() - amount);
                    break;
                case 'minute':
                case 'minutes':
                    newDate.setMinutes(newDate.getMinutes() - amount);
                    break;
                case 'second':
                case 'seconds':
                    newDate.setSeconds(newDate.getSeconds() - amount);
                    break;
            }
            return createMockDayjs(newDate);
        }),

        // Start/End of period
        startOf: vi.fn((unit: string) => {
            const newDate = new Date(mockDate);
            switch (unit) {
                case 'day':
                    newDate.setHours(0, 0, 0, 0);
                    break;
                case 'month':
                    newDate.setDate(1);
                    newDate.setHours(0, 0, 0, 0);
                    break;
                case 'year':
                    newDate.setMonth(0, 1);
                    newDate.setHours(0, 0, 0, 0);
                    break;
                case 'week':
                    const day = newDate.getDay();
                    const diff = newDate.getDate() - day;
                    newDate.setDate(diff);
                    newDate.setHours(0, 0, 0, 0);
                    break;
            }
            return createMockDayjs(newDate);
        }),

        endOf: vi.fn((unit: string) => {
            const newDate = new Date(mockDate);
            switch (unit) {
                case 'day':
                    newDate.setHours(23, 59, 59, 999);
                    break;
                case 'month':
                    newDate.setMonth(newDate.getMonth() + 1, 0);
                    newDate.setHours(23, 59, 59, 999);
                    break;
                case 'year':
                    newDate.setMonth(11, 31);
                    newDate.setHours(23, 59, 59, 999);
                    break;
                case 'week':
                    const day = newDate.getDay();
                    const diff = 6 - day;
                    newDate.setDate(newDate.getDate() + diff);
                    newDate.setHours(23, 59, 59, 999);
                    break;
            }
            return createMockDayjs(newDate);
        }),

        // Comparison methods
        isBefore: vi.fn(() => false),
        isAfter: vi.fn(() => false),
        isSame: vi.fn(() => true),
        isSameOrBefore: vi.fn(() => true),
        isSameOrAfter: vi.fn(() => true),

        // Utility methods
        valueOf: vi.fn(() => mockDate.getTime()),
        unix: vi.fn(() => Math.floor(mockDate.getTime() / 1000)),
        diff: vi.fn(() => 0),

        // Chainable methods
        clone: vi.fn(() => createMockDayjs(mockDate)),
        utc: vi.fn(() => createMockDayjs(mockDate)),
        local: vi.fn(() => createMockDayjs(mockDate)),
    };
};

// Mock the default export
const dayjsMock = vi.fn((date?: Date | string | number) => {
    return createMockDayjs(date);
});

// Add static methods
Object.assign(dayjsMock, {
    extend: vi.fn(),
    locale: vi.fn(),
    tz: vi.fn(),
    utc: vi.fn(() => createMockDayjs()),
    unix: vi.fn(() => createMockDayjs()),
    isDayjs: vi.fn(() => true),
});

export default dayjsMock;
