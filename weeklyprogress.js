export function calculateWeeklyProgress(workouts, goal, today = new Date()) {

    const startOfWeek = new Date(today);

    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const completed = workouts.filter(function(workout) {

        const workoutDate = new Date(workout.date + "T00:00:00");

        return workoutDate >= startOfWeek &&
               workoutDate < endOfWeek;

    }).length;

    const percentage = goal > 0
        ? Math.min((completed / goal) * 100, 100)
        : 0;

    return {
        completed: completed,
        goal: goal,
        percentage: percentage
    };
}