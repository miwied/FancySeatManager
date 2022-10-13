/*
miwied - FancySeatManager - october 2022
https://github.com/miwied/FancySeatManager
*/

// ## Classes ##

// stores the group information
class Group {
    constructor(setGroupSize) {
        this._size = setGroupSize; // group size
        this._id = Group.incrementId(); // autoincrement id
    }

    get Size() {
        return this._size;
    }

    get Id() {
        return this._id;
    }

    static incrementId() {
        if (!this.latestId) this.latestId = 1
        else this.latestId++
            return this.latestId
    }
}

// stores the seat information
class Seat {
    constructor(setUsedFlag) {
        this._isUsed = setUsedFlag; // is the seat used?
        this._isUsedByGroup = null; // seat used by group (id)
    }

    get isUsed() {
        return this._isUsed;
    }

    set isUsed(state) {
        this._isUsed = state;
    }

    get UsedByGroup() {
        return this._isUsedByGroup;
    }

    set UsedByGroup(groupId) {
        this._isUsedByGroup = groupId;
    }
}

// stores the empty-seats-counter with the associated index
class CounterAndIndex {
    constructor(SetCounter, SetIndex) {
        this._counter = SetCounter; // counter of empty seats
        this._index = SetIndex; // index where the counter starts
    }

    get Counter() {
        return this._counter;
    }

    set Counter(nr) {
        this._counter = nr;
    }

    get Index() {
        return this._index;
    }

    set Index(nr) {
        this._index = nr;
    }
}

// ## Functions ##


let Seats = []; // empty seats array
// set how many seats the table has
function SetSeatCount(numberOfSeats) {
    ResetValues();
    for (let i = 0; i < numberOfSeats; i++) {
        Seats.push(new Seat(false));
    }
    CreateCircles(numberOfSeats);
}


let Circles = []; // empty circles array
// draw seats / circles
function CreateCircles(count) {
    let smallCircleDiv = 360 / count;
    let radius = 150;
    let bigCircle = document.getElementById('bigCircle');
    let offsetToParentCenter = parseInt(bigCircle.offsetWidth / 2); //assumes parent is square
    let offsetToChildCenter = 20;
    let totalOffset = offsetToParentCenter - offsetToChildCenter;
    for (let i = 1; i <= count; ++i) {
        let smallCircle = document.createElement('smallCircleDiv');
        smallCircle.className = 'smallCircle';
        smallCircle.style.position = 'absolute';
        let y = Math.sin((smallCircleDiv * i) * (Math.PI / 180)) * radius;
        let x = Math.cos((smallCircleDiv * i) * (Math.PI / 180)) * radius;
        smallCircle.style.top = (y + totalOffset).toString() + "px";
        smallCircle.style.left = (x + totalOffset).toString() + "px";
        let smallCircleTxt = document.createElement('smallCircleText');
        smallCircleTxt.style.position = 'absolute';
        smallCircle.appendChild(smallCircleTxt);
        bigCircle.appendChild(smallCircle);
        Circles.push(smallCircle);
    }
}

// creates a totally different color based on the given number
function setRandomColor(number) {
    const hue = number * 137.508; // use golden angle approximation
    return `hsl(${hue},50%,75%)`;
}

// update all seats with the current state (empty or occupied)
function DrawCurrentSeatState() {
    for (let i = 0; i < Seats.length; i++) {
        if (Seats[i].isUsed) {
            GroupId = Seats[i].UsedByGroup;
            Circles[i].style.backgroundColor = setRandomColor(GroupId); // colorize the circle
            Circles[i].children[0].innerHTML = GroupId; // set groupid text in circle
            //fixing text offset of circle
            if (Number(GroupId) < 10) {
                yTextOffset = 15;
            } else {
                yTextOffset = 10;
            }
            Circles[i].children[0].style.left = yTextOffset + "px";
            Circles[i].children[0].style.top = "10px";
        } else {
            Circles[i].style.backgroundColor = "grey";
            Circles[i].children[0].innerHTML = "";
        }
    }
}

// add new group
function AddGroup(groupSize) {
    // create new group with user-inputed size
    if (CheckForSmallestEmptySeatChain(new Group(groupSize))) {
        document.getElementById("notificationText").style.color = "green";
        document.getElementById("notificationText").innerHTML = "Der Gruppe wurde ein Platz gegeben";
    } else {
        document.getElementById("notificationText").style.color = "red";
        document.getElementById("notificationText").innerHTML = "Es ist nicht genug Platz vorhanden";
        Group.latestId = Group.latestId - 1; // dont count the groupID up if group couldnt get a seat
    }
}

// remove group
function RemoveGroup(groupIndex) {
    // flag all seats as "unused" with the corresponding id
    Seats.forEach(seat => {
        if (seat.UsedByGroup == groupIndex) {
            seat.UsedByGroup = 0;
            seat.isUsed = false;
        }
    });
}

// reset and remove html-elements from dom and clear the arrays
function ResetValues() {
    Seats = [] // resetting seats array
    Group.latestId = 0; // resetting groupID

    // remove circle-html-elements
    for (let i = 0; i < Circles.length; i++) {
        Circles[i].remove();
    }

    Circles = []; // resetting cirlce array

    document.getElementById("notificationText").innerHTML = ""; // reset error / notification text
}

// search for empty seats and store the counter + index into the counters-list
function CheckForSmallestEmptySeatChain(group) {
    let Counters = [] // empty counters array
    let emptySeatChainCounter = 0;
    let lastSeatState = false;

    for (let i = 0; i < Seats.length; i++) {
        // if seat is empty
        if (!Seats[i].isUsed) {
            // if last seat was empty too
            if (!lastSeatState) {
                emptySeatChainCounter++; // count
            }
            lastSeatState = Seats[i].isUsed; // update last seat state
        }

        // is used to save the latest counter, if we are reaching a used-seat
        if (Seats[i].isUsed && !lastSeatState && emptySeatChainCounter != 0) {
            Counters.push(new CounterAndIndex(emptySeatChainCounter, i - Number(emptySeatChainCounter)));

            lastSeatState = false;
            emptySeatChainCounter = 0;
        }

        // saves the counter in the last iteration
        if (i == Seats.length - 1 && !Seats[i].isUsed) {
            Counters.push(new CounterAndIndex(emptySeatChainCounter, i - Number(emptySeatChainCounter) + 1));
        }

        // merge first and last counter together (so it is a loop, not a string)
        if ((i == Seats.length - 1) && !Seats[Seats.length - 1].isUsed && !Seats[0].isUsed && (Counters.length > 1)) {
            let firstCounter = 0;
            let highestIndex = 0;
            let CounterOfHighestIndex = 0;

            // get the first and highest index with the associated counters
            Counters.forEach(cai => {
                if (cai.Index == 0) {
                    firstCounter = cai.Counter;
                }

                if (cai.Index > highestIndex) {
                    highestIndex = cai.Index;
                    CounterOfHighestIndex = cai.Counter;
                }
            });

            CounterOfHighestIndex = Number(CounterOfHighestIndex) + Number(firstCounter); // adding both counters together

            // remove last counter
            if (Counters.length > 1) {
                Counters.splice(-1)
            }

            Counters.push(new CounterAndIndex(CounterOfHighestIndex, highestIndex)); // add new (merged) counter

            // remove first counter
            if (Counters.length > 1) {
                Counters.shift()
            }
        }
    }

    // remove (filter) counters that are smaller than the group-size
    for (let i = Counters.length - 1; i >= 0; i--) {
        if (Counters[i].Counter < group.Size) {
            Counters.splice(i, 1);
        }
    }

    // return if no counter is left over (no seat is avaliable)
    if (Counters.length == 0) {
        return false;
    }

    // from all the counters left, filter the smallest (most efficient) one
    let smallestCounter = Number.MAX_SAFE_INTEGER;
    let indexOfSmallestCounter = null;
    Counters.forEach(cai => {
        if (cai.Counter < smallestCounter) {
            smallestCounter = cai.Counter;
            indexOfSmallestCounter = cai.Index;
        }
    });

    // flag the determined seats as "used"
    let iterations = Number(indexOfSmallestCounter) + Number(group.Size);

    for (let i = indexOfSmallestCounter; i < iterations; i++) {
        // if last seat was reached, take the first again (loop)
        if (i > (Seats.length - 1)) {
            iterations = iterations - i; // subtract already flagged seats
            i = 0; // reset i
        }
        Seats[i].isUsed = true; // flag seat
        Seats[i].UsedByGroup = group.Id; // save which group (id) sits here
    }
    return true;
}

// ## Buttons ##

// create seats input
document.getElementById("seatCountBtn").onclick = function() {
    SetSeatCount(document.getElementById("seatCountTxt").value);

    DrawCurrentSeatState();
}

// add group input
document.getElementById("addGroupBtn").onclick = function() {
    AddGroup(document.getElementById("addGroupTxt").value);

    DrawCurrentSeatState();
}

// remove group input
document.getElementById("removeGroupBtn").onclick = function() {
    RemoveGroup(document.getElementById("removeGroupTxt").value);

    DrawCurrentSeatState();
}

// reset button
document.getElementById("resetBtn").onclick = function() {
    ResetValues();

    // reset input fields
    document.getElementById("removeGroupTxt").value = "";
    document.getElementById("addGroupTxt").value = "";
    document.getElementById("seatCountTxt").value = "";

    DrawCurrentSeatState();
}