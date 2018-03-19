// Version number
var versionNumber = '0.31818';

// Awareness Intro Game Stat
var isAware = true;
var awareness = 0;
var tutorial = 0;
var tick=0;

// Feature Unlocks
var capsRevealed = false;
var incRevealed = false;
var capRaiseRevealed = false;
var combatRevealed = false;
var deathStatRevealed = false;
var hpTrainButtonRevealed = false;
var atkTrainButtonRevealed = false;
var autoIncTrainingRevealed = false;

// time variables
var firstTimeMessage = false;
var secondTimeMessage = false;

// Stats
var training = 0;
var intelligence = 0;
var hp = 1;
var totalHp = 1;
var atk = 1;
var deaths = 1;

// Incrementors
var trainingInc = 1;
var intelligenceInc = 1;

// Auto incrementors
var intelligenceAutoInc = 0;
var trainingAutoInc = 0;

// Multipliers
var trainingMult = 1;
var intelligenceMult = 1;

// Caps
var capFactor = 1.5;
var trainingCap = 100;
var intelligenceCap = 100;

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
        if (tutorial == 3) {
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

function trainAutoIntInc() {
    if (deaths < 10) {
        alert('You need more temporal energy to train this stat');
        return false;
    } else {
        deaths -= 10;
        intelligenceAutoInc++;
        updateActionFeedback('You channel temporal energy towards your thinking time, old you is helping new you be smarter');
        trackTime();
    }
}

function trainAutoTrainingInc() {
    if (deaths < 10) {
        alert('You need more temporal energy to train this stat');
        return false;
    } else {
        deaths -= 10;
        trainingAutoInc++;
        updateActionFeedback('You channel temporal energy towards your training time, old you is helping new you be stronger');
        trackTime();
    }
}

function trainHp() {
    if (training < 150) {
        alert('Not enough training, need 150 to increase hp.');
        return false;
    } else {
        training -=150;
        totalHp++;
        hp++;
        trackTime();
    }
}

function lookPhase1() {
    incIntellect();
    if (!hasAwardedIntelligenceIncCap && intelligence >= 10 && intelligenceInc < 10) {
        intelligenceInc++;
        hasAwardedIntelligenceIncCap = true;
        updateMainStory('Thinking about your situation more you realize that the item on your chest must be somehow relaying your intellect back in time each time you die.  You wonder if you can somehow exploit that.');
        pulseGently();
    } else if (intelligence >= 25 && !capsRevealed) {
        $('#intelligenceCapContainer')[0].style.display="inline";
        $('#trainingCapContainer')[0].style.display="inline";
        capsRevealed = true;
        updateMainStory('You are starting to understand the limits of your present existence. (You can now see your ability caps by hovering over them in the statistics panel)');
        pulseStrongly();
    } else if (intelligence >= 45 && !incRevealed) {
        incRevealed = true;
        console;
        $('#intelligenceIncContainer')[0].style.display="inline";
        $('#trainingIncContainer')[0].style.display="inline";
        updateMainStory('You now know that you are growing faster as you loop through the cycle, and can gauge its rate of growth! (You can now see how fast your ability scores are going up per click in the tooltips)');
        pulseStrongly();
    } else if (intelligence >= 75 && !capRaiseRevealed) {
        updateMainStory('There is a limit to your abilities, but is it a hard limit?  You think if you were to spend a large amount of effort when you are at your limit, you might be able to train yourself to further heights in the next cycle.');
        updateMainStory('(If you are at cap, and you press the training button again you will consume all of your currently banked attribute, but in exchange your cap will increase.)');
        capRaiseRevealed = true;
        pulseStrongly();
    } else if (intelligence > 150 && deathStatRevealed && !autoIncTrainingRevealed) {
        updateMainStory("Thinking about all of this temporal energy you are gaining you wonder if you could somehow take some of the time you are spending training each cycle into the next cycle.");
        updateMainStory("You think it should be possible, and almost on cue a panel lights up on the side of the room, glowing the same blue color that your chest does. ");
        updateMainStory("On the panel is an interface, with multiple buttons.  These buttons seem to correspond to activities you have been doing.");
        autoIncTrainingRevealed=true;
        $('#intelligenceAutoIncContainer')[0].style.display="inline";
        $('#trainingAutoIncContainer')[0].style.display="inline";
        $('#intelligenceAutoIncContainer').click(trainAutoIntInc);
        $('#trainingAutoIncContainer').click(trainAutoTrainingInc);
        pulseStrongly();
    }
    else if (intelligence == intelligenceCap  && capRaiseRevealed) {
        Math.round(intelligenceCap = intelligenceCap * capFactor);
        intelligence = 0;
        updateMainStory("Suddenly you feel a pulse and all of the knowledge you had gained thus far drains out of you, but you feel like you have more potential.");
        pulseGently();
    }
    else {
        updateActionFeedback('You carefully consider the situation you are in.');
    }
}

function decorateToolTips() {
    if (capsRevealed) {
        $('#intelligenceCap')[0].innerHTML=intelligenceCap;
        $('#trainingCap')[0].innerHTML=trainingCap;
    }
    if (incRevealed) {
        $('#intelligenceInc')[0].innerHTML=intelligenceInc;
        $('#trainingInc')[0].innerHTML=trainingInc;
    }
    if (combatRevealed) {
        $('#hpValue')[0].innerHTML='' + hp + '/' + totalHp;
        $('#atkValue')[0].innerHTML=atk;
    }
    if (deathStatRevealed) {
        $('#deathValue')[0].innerHTML=deaths;
    }
    if (autoIncTrainingRevealed) {
        $('#intelligenceAutoInc')[0].innerHTML=intelligenceAutoInc;
        $('#trainingAutoInc')[0].innerHTML=trainingAutoInc;
    }
}

function trainPhase1() {
    incTraining();
        if (!hasAwardedTrainingIncCap && training >= 10 && trainingInc < 10) {
            trainingInc++;
            hasAwardedTrainingIncCap = true;
            if (trainingInc < 6) {
                updateMainStory('You work on controlling your various limbs, trying to use it as effectively as the your own body.');
            } else if (trainingInc < 10) {
                updateMainStory('You are getting the hang of this new body, you almost no longer feel the difference.');
            }
            pulseGently();
        } else if (!combatRevealed && training > 50) {
            combatRevealed = true;
            $('#combat')[0].style.display="block";
            updateMainStory('The more you move around the more sure that you become: You are going to have to fight this creature.  Its time to start thinking about how that will work.');
            pulseStrongly();
        } else if (!hpTrainButtonRevealed && training > 85) {
            $('#trainHp')[0].style.display="inline";
            $('#trainHp').click(trainHp);
            hpTrainButtonRevealed = true;
        } else if (training == trainingCap && capRaiseRevealed) {
            Math.round(trainingCap = trainingCap * capFactor);
            training = 0;
            updateMainStory("Suddenly you feel a pulse and all of the coordination you had gained thus far drains out of you, but you feel like you have more potential.");
            pulseGently();
        }
        else {
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
    $('#intelligenceValue')[0].innerHTML = intelligence;

    // Finally track the tick
    trackTime();
}

function autoIncIntellect() {
    if (intelligenceAutoInc > 0) {
        intelligence += intelligenceAutoInc;
    }
}

function autoIncTraining() {
    if (trainingAutoInc > 0) {
        training += trainingAutoInc;
    }
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
        if (intelligence < 100 && training < 100) {
            updateMainStory('The creature bursts into the room, and finishes you off just like before.');
        } else if (intelligence < 100) {
            updateMainStory('The creature bursts into the room, and comes for you.  You are able to dodge its attacks initially, but it is more seasoned than you and eventually corners and kills you.');
        } else if (training < 100) {
            updateMainStory('The creature bursts into the room, and starts to come after you.  You however anticipate its attack patterns and hold out for a while.  Unfortunately you do not have the stamina to fight back and eventually the creature wears you down and kills you.');
        } else {
            updateMainStory("Imagine you are fighting in this really cool combat system right now.  Sadly I have not written it yet, so suck it, you die.");
        }
        resetPhase1();
    }

    // FIre the auto inc's
    autoIncTraining();
    autoIncIntellect();

    // This is now centralized and will be called each tick
    decorateToolTips();
    tick++;
}

function resetPhase1() {

    // Scores
    resetAbilityScores();

    // Tick messages
    resetTickMessages();

    $('#mainStory').animate({borderColor:'red'}, 400)
      .delay(400)
      .animate({borderColor:'black'}, 1000);
    tick = 0;

    deaths++;
    if (deaths >= 10) {
        updateMainStory('As you die you notice that the pulse coming from your chest is getting a bit stronger each time.  When you come back to you notice that some of the blue light that has come from it is absorbed back in, causing the glow to become slightly stronger over the cycles.  You are not sure what use this is for you, bit you think you can estimate how large the effect is from here onward.');
        $('#deathStat')[0].style.display="block";
        pulseStrongly();
        deathStatRevealed=true;
    }
    decorateToolTips();
};

function resetTickMessages() {
    firstTimeMessage = false;
    secondTimeMessage = false;
}

function resetAbilityScores() {
    intelligence = 0;
    updateIntelligence(intelligence);
    training = 0;
    hasAwardedTrainingIncCap = false;
    hasAwardedIntelligenceIncCap = false;
    updateTraining(training);
}

function incTraining() {
    training = training + (trainingInc * trainingMult);
    if (training > trainingCap) {
        training = trainingCap;
    }
    updateTraining(training);
}

function updateTraining(training) {
    $('#trainingValue')[0].innerHTML = training;
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
    $('#versionNumber')[0].innerHTML = 'Version: ' + versionNumber;
});
