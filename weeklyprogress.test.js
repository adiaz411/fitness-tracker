import { describe, it, expect } from "vitest";

import { calculateWeeklyProgress } from "./weeklyprogress.js";

describe("Weekly Fitness Progress Tracker", () => {

    // TEST 1: Normal case
    // User completes 2 workouts with a goal of 5

    it("calculates weekly workout progress correctly", () => {

        const workouts = [
            { date: "2026-11-23" },
            { date: "2026-11-24" }
        ];

        const result = calculateWeeklyProgress(
            workouts,
            5,
            new Date(2026, 10, 24)
        );

        expect(result.completed).toBe(2);

        expect(result.goal).toBe(5);

        expect(result.percentage).toBe(40);

    });

});

// TEST 2: Edge case- No completed workouts
it("returns 0% when no workouts are completed", () => {

    const workouts = [];

    const result = calculateWeeklyProgress(

        workouts,

        5,

        new Date(2026, 10, 24)

    );

    expect(result.completed).toBe(0);

    expect(result.goal).toBe(5);

    expect(result.percentage).toBe(0);

});