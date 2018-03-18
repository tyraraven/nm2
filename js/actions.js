// Awareness Intro Game Stat
var isAware = false;
var awareness = 0;
var tutorial = 0;
var tick=0;

// Feature Unlocks
var capsRevealed = false;

// Stats
var training = 0;
var intelligence = 0;

// Incrementors
var trainingInc = 1;
var intelligenceInc = 1;

// Multipliers
var trainingMult = 1;
var intelligenceMult = 1;

// Caps
var trainingCap = 50;
var intelligenceCap = 50;

function lookAction() {
    if (!isAware) {
        if (awareness < phaseOneMessages.length) {
            updateMainStory(phaseOneMessages[awareness]);
            awareness++;
        }
        if (awareness == 10) {
            document.getElementById('look').innerHTML = 'Look Around';
        }
        if (awareness == phaseOneMessages.length) {
            isAware = true;
        }
    } else {
        updateMainStory(tutorialMessages[tutorial]);
        if (tutorial == 4) {
            document.getElementById('mainStats').style.display='block';
            document.getElementById('actionFeedback').style.display='block';
            document.getElementById('train').style.display='block';
            document.getElementById('look').innerHTML = 'Consider';
            updateMainStory('You are in a room with patterns on the walls.');
            $("#look").off("click");
            $("#look").click(lookPhase1);
            $("#train").click(trainPhase1);
        }
        tutorial++;
    }
}

function lookPhase1() {
    incIntellect();
    if (intelligence >= 10 && intelligenceInc < 2) {
        intelligenceInc++;
        updateMainStory('Thinking about your situation more you realize that the item on your chest must be somehow relaying your intellect back in time each time you die.' +
        '  Upon coming to this realization the item pulses gently once and you feel like you have learned something that you can use going forward');
    } else if (intelligence > 25 && !capsRevealed) {
        $('[data-toggle="popover"]').popover();
        $(intelligenceValue).attr('data-content','Cap: ' + intelligenceCap);
        $(sosValue).attr('data-content','Cap: ' + trainingCap);
        updateMainStory('You are starting to understand the limits of your present existence. (You can now see your ability caps by hovering over them in the statistics panel)');
        capsRevealed = true

    }
    else {
        updateActionFeedback('You carefully consider the situation you are in.');
    }
}

function trainPhase1() {
    incSenseOfSelf();
        if (training >= 10 && trainingInc < 2) {
            trainingInc++;
            updateMainStory('You work on controlling your various limbs, trying to use it as effectively as the your own body.' +
            '  Suddenly the body you are in seems significantly less unfamiliar, and you are able to move around the room without having to put much though into it.  The item on your chest pulses gently once.');
        } else {
            updateActionFeedback('You attempt to figure out how to move around in this body more effectively');
        }
}

function incIntellect() {
    intelligence = intelligence + (intelligenceInc * intelligenceMult);
    if (intelligence > intelligenceCap) {
        intelligence = intelligenceCap;
    }
    document.getElementById('intelligenceValue').innerHTML = intelligence;
}

function trackTime() {
    tick++;
}


function incSenseOfSelf() {
    training = training + (trainingInc * trainingMult);
    if (training > trainingCap) {
        training = trainingCap;
    }
    document.getElementById('sosValue').innerHTML = training;
}

function updateActionFeedback(message) {
    document.getElementById('actionFeedback').value = message;
}

function updateMainStory(message) {
    document.getElementById('mainStory').value += '\n' + message;
    $('#mainStory').scrollTop($('#mainStory')[0].scrollHeight);
}

$( document ).ready(function() {
    $('#look').click(lookAction);
});
