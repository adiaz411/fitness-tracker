// FITNESS TRACKER - SPRINT 1

// Load previously saved workouts
let workouts = JSON.parse(localStorage.getItem("workouts")) || [];

const workoutForm = document.getElementById("workout-form");
const workoutList = document.getElementById("workout-list");

// Save workout
workoutForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const workout = {
        id: Date.now(),

        name: document.getElementById("workout-name").value,

        type: document.getElementById("workout-type").value,

        date: document.getElementById("workout-date").value,

        duration: Number(document.getElementById("duration").value),

        distance: Number(document.getElementById("distance").value),

        sets: Number(document.getElementById("sets").value),

        reps: Number(document.getElementById("reps").value),

        weight: Number(document.getElementById("weight").value)
    };


    // Add workout to list
    workouts.push(workout);

    // Save workouts in browser
    localStorage.setItem("workouts", JSON.stringify(workouts));

    // Update website
    displayWorkouts();

    updateDashboard();

    // Clear form
    workoutForm.reset();

    alert("Workout saved successfully!");
});

// Display workout history
function displayWorkouts() {
    workoutList.innerHTML = "";

    if (workouts.length === 0) {
        workoutList.innerHTML = "<p>No workouts recorded yet.</p>";
        return;
    }

    workouts.forEach(function(workout) {
        const workoutCard = document.createElement("div");
        workoutCard.className = "workout-item";

        const title = document.createElement("h3");
        title.textContent = workout.name;

        const details = document.createElement("p");
        details.textContent =
            `${workout.type} | ${workout.date} | ` +
            `${workout.duration} minutes | ` +
            `${workout.distance} miles | ` +
            `${workout.sets} sets | ` +
            `${workout.reps} reps | ` +
            `${workout.weight} lbs`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete Workout";
        deleteButton.addEventListener("click", function() {
            deleteWorkout(workout.id);
        });

        workoutCard.appendChild(title);
        workoutCard.appendChild(details);
        workoutCard.appendChild(deleteButton);

        workoutList.appendChild(workoutCard);
    });
}

// Delete workout
function deleteWorkout(id) {
    workouts = workouts.filter(function(workout) {
        return workout.id !== id;
    });

    localStorage.setItem("workouts", JSON.stringify(workouts));

    displayWorkouts();
    updateDashboard();
}

// Update dashboard 
function updateDashboard() {

    // Total workouts
    document.getElementById("total-workouts").textContent =
        workouts.length;

    // Total minutes
    const totalMinutes = workouts.reduce(function(total, workout) {
        return total + workout.duration;
    }, 0);

    document.getElementById("total-minutes").textContent =
        totalMinutes;

    // Workouts completed this week
    const today = new Date();

    const startOfWeek = new Date(today);
    const day = today.getDay();

    startOfWeek.setDate(today.getDate() - day);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const weeklyWorkouts = workouts.filter(function(workout) {
        const workoutDate = new Date(workout.date + "T00:00:00");

        return workoutDate >= startOfWeek &&
               workoutDate < endOfWeek;
    });

    document.getElementById("weekly-workouts").textContent =
        weeklyWorkouts.length;
}

// Load saved workouts 
displayWorkouts();
updateDashboard();

// Sprint 2- Adding Progress Tracker

// Load saved weekly goal

let weeklyGoal = Number(localStorage.getItem("weeklyGoal")) || 5;

// Get progress tracker elements

const weeklyGoalInput = document.getElementById("weekly-goal");

const saveGoalButton = document.getElementById("save-goal");

const progressFill = document.getElementById("progress-fill");

const progressPercentage = document.getElementById("progress-percentage");

const progressMessage = document.getElementById("progress-message");

// Display saved goal

weeklyGoalInput.value = weeklyGoal;

// Calculate weekly workout progress

function calculateWeeklyProgress(workouts, goal, today = new Date()) {

    const startOfWeek = new Date(today);

    startOfWeek.setDate(today.getDate() - today.getDay());

    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);

    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const completedWorkouts = workouts.filter(function(workout) {

        const workoutDate = new Date(workout.date + "T00:00:00");

        return workoutDate >= startOfWeek &&

               workoutDate < endOfWeek;

    }).length;

    const percentage = goal > 0

        ? Math.min((completedWorkouts / goal) * 100, 100)

        : 0;

    return {

        completed: completedWorkouts,

        goal: goal,

        percentage: percentage

    };

}

// Update progress tracker display

function updateProgressTracker() {

    const progress = calculateWeeklyProgress(workouts, weeklyGoal);

    progressFill.style.width = progress.percentage + "%";

    progressPercentage.textContent =

        Math.round(progress.percentage) + "%";

    progressMessage.textContent =

        progress.completed + " of " +

        progress.goal + " workouts completed";

    const progressBar = progressFill.parentElement;

    progressBar.setAttribute(

        "aria-valuenow",

        Math.round(progress.percentage)

    );

}

// Save weekly workout goal

saveGoalButton.addEventListener("click", function() {

    const newGoal = Number(weeklyGoalInput.value);

    if (!Number.isInteger(newGoal) || newGoal < 1) {

        alert("Please enter a valid weekly goal.");

        return;

    }

    weeklyGoal = newGoal;

    localStorage.setItem("weeklyGoal", weeklyGoal);

    updateProgressTracker();

    alert("Weekly goal saved successfully!");

});

// Load progress when website opens

updateProgressTracker();


document.getElementById("weekly-workouts").textContent =
    weeklyWorkouts.length;

    