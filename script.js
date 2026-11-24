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

        distance: Number(document.getElementById("distance").value) || 0,

        sets: Number(document.getElementById("sets").value) || 0,

        reps: Number(document.getElementById("reps").value) || 0,

        weight: Number(document.getElementById("weight").value) || 0

    };


    // Add workout to list
    workouts.push(workout);

    // Save workouts in browser
    localStorage.setItem("workouts", JSON.stringify(workouts));

    // Update website
    displayWorkouts();

    updateDashboard();

// Update progress tracker

    if (typeof updateProgressTracker === "function") {

        updateProgressTracker();

    }
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

    // Save 
    localStorage.setItem("workouts", JSON.stringify(workouts));

    // Updatehistory
    displayWorkouts();

    // Update dashboard
    updateDashboard();

    // Update progress tracker
    updateProgressTracker();
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

// Get HTML elements

const weeklyGoalInput = document.getElementById("weekly-goal");

const saveGoalButton = document.getElementById("save-goal");

const progressFill = document.getElementById("progress-fill");

const progressPercentage = document.getElementById("progress-percentage");

const progressMessage = document.getElementById("progress-message");

const completedWorkouts = document.getElementById("completed-workouts");

const goalDisplay = document.getElementById("goal-display");

// Display saved goal

weeklyGoalInput.value = weeklyGoal;

// Calculate 

function calculateWeeklyProgress(workouts, goal, today = new Date()) {

    const startOfWeek = new Date(today);

    startOfWeek.setDate(today.getDate() - today.getDay());

    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);

    endOfWeek.setDate(startOfWeek.getDate() + 7);

    // Count workouts completed this week

    const completed = workouts.filter(function(workout) {

        const workoutDate = new Date(workout.date + "T00:00:00");

        return workoutDate >= startOfWeek &&

               workoutDate < endOfWeek;

    }).length;

    // Calculate progress percentage

    const percentage = goal > 0

        ? Math.min((completed / goal) * 100, 100)

        : 0;

    return {

        completed: completed,

        goal: goal,

        percentage: percentage

    };

}



// UPDATE PROGRESS TRACKER

function updateProgressTracker() {

    const progress = calculateWeeklyProgress(workouts, weeklyGoal);

    // Update completed workouts

    completedWorkouts.textContent = progress.completed;

    // Update goal display

    goalDisplay.textContent = progress.goal;

    // Move bar

    progressFill.style.width = progress.percentage + "%";



    progressFill.parentElement.setAttribute(

        "aria-valuenow",

        Math.round(progress.percentage)

    );

    // Update percentage if element exists

    if (progressPercentage) {

        progressPercentage.textContent =

            Math.round(progress.percentage) + "%";

    }

    // Update progress message if element exists

    if (progressMessage) {

        if (progress.completed >= progress.goal) {

            progressMessage.textContent =

                "Congratulations! You reached your weekly goal!";

        } else {

            progressMessage.textContent =

                (progress.goal - progress.completed) +

                " more workouts to reach your weekly goal!";

        }

    }

}


saveGoalButton.addEventListener("click", function() {

    const newGoal = Number(weeklyGoalInput.value);

    if (!Number.isInteger(newGoal) || newGoal < 1) {

        alert("Please enter a valid weekly goal.");

        return;

    }

    weeklyGoal = newGoal;

    // Save goal in browser

    localStorage.setItem("weeklyGoal", weeklyGoal);

    // Update progress

    updateProgressTracker();

    alert("Weekly goal saved successfully!");

});


updateProgressTracker();