// Awareness Intro Game Stat
var isAware = true;
var awareness = 0;
var tutorial = 0;
var tick=0;

// Feature Unlocks
var capsRevealed = false;
var incRevealed = false;

// time variables
var firstTimeMessage = false;
var secondTimeMessage = false;

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

// Per pass bonus checks
var hasAwardedIntelligenceIncCap = false;
var hasAwardedTrainingIncCap = false;

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
    if (!hasAwardedIntelligenceIncCap && intelligence >= 10 && intelligenceInc < 10) {
        intelligenceInc++;
        hasAwardedIntelligenceIncCap = true;
        updateMainStory('Thinking about your situation more you realize that the item on your chest must be somehow relaying your intellect back in time each time you die.  You wonder if you can somehow exploit that.');
        pulseGently();
        decorateToolTips();
    } else if (intelligence >= 25 && !capsRevealed) {
        $('[data-toggle="popover"]').popover();
        capsRevealed = true;
        decorateToolTips();
        updateMainStory('You are starting to understand the limits of your present existence. (You can now see your ability caps by hovering over them in the statistics panel)');
        pulseStrongly();
    } else if (intelligence >= 45 && !incRevealed) {
        incRevealed = true;
        decorateToolTips();
        updateMainStory('You now know that you are growing faster as you loop through the cycle, and can gauge its rate of growth! (You can now see how fast your ability scores are going up per click in the tooltips)');
        pulseStrongly();
    }
    else {
        updateActionFeedback('You carefully consider the situation you are in.');
    }
}

function decorateToolTips() {
    let intMessage = '';
    let trainingMessage = '';
    if (capsRevealed) {
        intMessage += 'Cap: ' + intelligenceCap;
        trainingMessage += 'Cap: ' + trainingCap;
    }
    if (incRevealed) {
        intMessage += ' Incrementer: ' + intelligenceInc;
        trainingMessage += ' Incrementer: ' + trainingInc;
    }

    $(intelligenceValue).attr('data-content',intMessage);
    $(sosValue).attr('data-content',trainingMessage);
}

function trainPhase1() {
    incSenseOfSelf();
        if (!hasAwardedTrainingIncCap && training >= 10 && trainingInc < 10) {
            trainingInc++;
            hasAwardedTrainingIncCap = true;
            if (trainingInc < 6) {
                updateMainStory('You work on controlling your various limbs, trying to use it as effectively as the your own body.');
            } else if (trainingInc < 10) {
                updateMainStory('You are getting the hang of this new body, you almost no longer feel the difference.');
            }
            pulseGently();
        } else {
            updateActionFeedback('You attempt to figure out how to move around in this body more effectively');
        }

     // Finally track the tick
     trackTime();
}

function pulseGently() {
    updateMainStory('The item on your chest pulses gently once.');
}

function pulseStrongly() {
    updateMainStory('The item on your chest pulses strongly, something significant has changed.');
}

function incIntellect() {
    intelligence = intelligence + (intelligenceInc * intelligenceMult);
    if (intelligence > intelligenceCap) {
        intelligence = intelligenceCap;
    }
    document.getElementById('intelligenceValue').innerHTML = intelligence;

    // Finally track the tick
    trackTime();
}

function trackTime() {
    if (!firstTimeMessage && tick >= 10) {
        updateMainStory('You hear soft pounding on the door, the creature has arrived');
        firstTimeMessage = true;
    } else if (!secondTimeMessage && tick >= 15) {
        updateMainStory('The banging on the door has become very loud, the creature is almost inside');
        secondTimeMessage = true;
    } else if (tick >=25) {
        // Check stats/abilities either overcome creature and goto phase 2, or reset allowing level up.
        updateMainStory('The creature bursts into the room, and finishes you off just like before.');
        resetPhase1();
    }
    tick++;
}

function resetPhase1() {

    // Scores
    resetAbilityScores();

    $('#mainStory').animate({borderColor:'red'}, 400)
      .delay(400)
      .animate({borderColor:'black'}, 1000);
    tick = 0;
};

function resetAbilityScores() {
    intelligence = 0;
    updateIntelligence(intelligence);
    training = 0;
    hasAwardedTrainingIncCap = false;
    hasAwardedIntelligenceIncCap = false;
    updateSenseOfSelf(training);
}

function incSenseOfSelf() {
    training = training + (trainingInc * trainingMult);
    if (training > trainingCap) {
        training = trainingCap;
    }
    updateSenseOfSelf(training);
}

function updateSenseOfSelf(training) {
    document.getElementById('sosValue').innerHTML = training;
}

function updateIntelligence(intelligence) {
    document.getElementById('intelligenceValue').innerHTML = intelligence;
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
