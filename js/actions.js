// Version number
var versionNumber = '0.31819';

// Awareness Intro Game Stat
var isAware = true;
var awareness = 0;
var tutorial = 0;

// Feature Unlocks
var hpTrainButtonRevealed = false;
var atkTrainButtonRevealed = false;
var autoIncTrainingRevealed = false;
var combatSkillsRevealed = false;
var firstCombatUnlocksRevealed = false;

// Special Combat Variables
var firstCombatEngaged = false;
var firstCombatWon = false;

// Combat
var inCombat = false;
var mob;
var didAttack = false;

// basic attack
var basicAttackExp = 0;
var basicAttackLevelUpCost = 10;
var basicAttackCost = 150;

// time variables
var firstTimeMessage = false;
var secondTimeMessage = false;

var player = {
    hp: 1,
    totalHp: 1,
    atk: 1
};

var gs = {
    training: 0,
    capsRevealed: false,
    incRevealed: false,
    capRaiseRevealed: false,
    combatRevealed: false,
    intelligence: 0,
    deaths: 1,
    trainingInc: 1,
    intelligenceInc: 1,
    deathInc: 1,
    capFactor: 1.5,
    trainingCap: 100,
    intelligenceCap: 100,
    intelligenceAutoInc: 0,
    trainingAutoInc: 0,
    trainingMult: 1,
    intelligenceMult: 1,
    tick: 0,
    deathStatRevealed: false
};

// Per pass bonus checks
var hasAwardedIntelligenceIncCap = false;
var hasAwardedTrainingIncCap = false;

var shardBosses = [];
shardBosses.push(["Strange Creature", 10, 5, 1]);

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
            finishTutorial();
        }
        tutorial++;
    }
}

function finishTutorial() {
    document.getElementById('mainStats').style.display='block';
    document.getElementById('actionFeedback').style.display='block';
    document.getElementById('train').style.display='inline';
    document.getElementById('look').innerHTML = 'Consider';
    updateMainStory('You are in a room with patterns on the walls.');
    $("#look").off("click");
    $("#look").click(lookPhase1);
    $("#train").click(trainPhase1);
}

function trainAutoIntInc() {
    if (gs.deaths < 10) {
        alert('You need more temporal energy to train this stat');
        return false;
    } else {
        gs.deaths -= 10;
        gs.intelligenceAutoInc++;
        updateActionFeedback('You channel temporal energy towards your thinking time, old you is helping new you be smarter');
        trackTime();
    }
}

function trainAutoTrainingInc() {
    if (gs.deaths < 10) {
        alert('You need more temporal energy to train this stat');
        return false;
    } else {
        gs.deaths -= 10;
        gs.trainingAutoInc++;
        updateActionFeedback('You channel temporal energy towards your training time, old you is helping new you be stronger');
        trackTime();
    }
}

function trainAtk() {
    if (gs.training < 150) {
        alert('Not enough training, need 150 to increase hp.');
        return false;
    } else {
        gs.training -=150;
        player.atk++;
        trackTime();
    }
}

function trainHp() {
    if (gs.training < 150) {
        alert('Not enough training, need 150 to increase hp.');
        return false;
    } else {
        gs.training -=150;
        player.totalHp++;
        player.hp++;
        trackTime();
    }
}

function lookPhase1() {
    incIntellect();
    updateActionFeedback('You carefully consider the situation you are in.');
    trackTime();
}

function revealCaps() {
    $('#intelligenceCapContainer')[0].style.display="inline";
    $('#trainingCapContainer')[0].style.display="inline";
}

function revealInc() {
    $('#intelligenceIncContainer')[0].style.display="inline";
    $('#trainingIncContainer')[0].style.display="inline";
}

function checkIntelligenceUnlocks () {
    if (!hasAwardedIntelligenceIncCap && gs.intelligence >= 10 && gs.intelligenceInc < 10) {
        gs.intelligenceInc++;
        hasAwardedIntelligenceIncCap = true;
        updateActionFeedback('Thinking about your situation more you realize that the item on your chest must be somehow relaying your intellect back in time each time you die.  You wonder if you can somehow exploit that. (+1 Int per Click)');
        pulseGently();
    } else if (gs.intelligence >= 25 && !gs.capsRevealed) {
        revealCaps();
        gs.capsRevealed = true;
        pulseStrongly();
        updateMainStory('You are starting to understand the limits of your present existence. (You can now see your ability caps statistics panel)');
    } else if (gs.intelligence >= 45 && !gs.incRevealed) {
        gs.incRevealed = true;
        revealInc();
        console;
        pulseStrongly();
        updateMainStory('You now know that you are growing faster as you loop through the cycle, and can gauge its rate of growth! (You can now see how fast your ability scores are going up per click in the tooltips)');
    } else if (gs.intelligence >= 75 && !gs.capRaiseRevealed) {
        pulseStrongly();
        updateMainStory('There is a limit to your abilities, but is it a hard limit?  You think if you were to spend a large amount of effort when you are at your limit, you might be able to train yourself to further heights in the next cycle.');
        updateMainStory('(If you are at cap, and you press the training button again you will consume all of your currently banked attribute, but in exchange your cap will increase.)');
        gs.capRaiseRevealed = true;
    } else if (gs.intelligence > 150 && gs.deathStatRevealed && !autoIncTrainingRevealed) {
        pulseStrongly();
        updateMainStory("Thinking about all of this temporal energy you are gaining you wonder if you could somehow take some of the time you are spending training each cycle into the next cycle.");
        updateMainStory("You think it should be possible, and almost on cue a panel lights up on the side of the room, glowing the same blue color that your chest does. ");
        updateMainStory("On the panel is an interface, with multiple buttons.  These buttons seem to correspond to activities you have been doing.");
        autoIncTrainingRevealed=true;
        $('#intelligenceAutoIncContainer')[0].style.display="inline";
        $('#trainingAutoIncContainer')[0].style.display="inline";
        $('#intelligenceAutoIncContainer').click(trainAutoIntInc);
        $('#trainingAutoIncContainer').click(trainAutoTrainingInc);
    }
    else if (gs.intelligence >= gs.intelligenceCap  && gs.capRaiseRevealed) {
        gs.intelligenceCap = Math.round(gs.intelligenceCap = gs.intelligenceCap * gs.capFactor);
        gs.intelligence = 0;
        updateMainStory("Suddenly you feel a pulse and all of the knowledge you had gained thus far drains out of you, but you feel like you have more potential.");
        pulseGently();
    }
}

function decorateToolTips() {
    $('#intelligenceValue')[0].innerHTML = gs.intelligence;
    $('#trainingValue')[0].innerHTML = gs.training;
    $('#tickValue')[0].innerHTML = gs.tick;
    if (gs.capsRevealed) {
        $('#intelligenceCap')[0].innerHTML=gs.intelligenceCap;
        $('#trainingCap')[0].innerHTML=gs.trainingCap;
    }
    if (gs.incRevealed) {
        $('#intelligenceInc')[0].innerHTML=gs.intelligenceInc;
        $('#trainingInc')[0].innerHTML=gs.trainingInc;
    }
    if (gs.combatRevealed) {
        $('#hpValue')[0].innerHTML='' + player.hp + '/' + player.totalHp;
        $('#atkValue')[0].innerHTML=player.atk;
    }
    if (gs.deathStatRevealed) {
        $('#deathValue')[0].innerHTML=gs.deaths;
    }
    if (autoIncTrainingRevealed) {
        $('#intelligenceAutoInc')[0].innerHTML=gs.intelligenceAutoInc;
        $('#trainingAutoInc')[0].innerHTML=gs.trainingAutoInc;
    }
    if (combatSkillsRevealed) {
        $('#basicAttackCost')[0].innerHTML=basicAttackCost;
        $('#basicAttackTNL')[0].innerHTML=basicAttackExp + '/' + basicAttackLevelUpCost;
    }
}

function trainPhase1() {
    incTraining();
    updateActionFeedback('You attempt to figure out how to move around in this body more effectively');
    trackTime();
}

function revealCombat() {
    $('#combat')[0].style.display="block";
}

function checkTrainingUnlocks () {
        if (!hasAwardedTrainingIncCap && gs.training >= 10 && gs.trainingInc < 10) {
            gs.trainingInc++;
            hasAwardedTrainingIncCap = true;
            updateActionFeedback('You work on controlling your various limbs, trying to use it as effectively as the your own body. (+1 Training per click)');
            pulseGently();
        } else if (!gs.combatRevealed && gs.training > 50) {
            gs.combatRevealed = true;
            revealCombat();
            updateMainStory('The more you move around the more sure that you become: You are going to have to fight this creature.  Its time to start thinking about how that will work.');
            pulseStrongly();
        } else if (!hpTrainButtonRevealed && gs.training > 85) {
            $('#trainHp')[0].style.display="inline";
            $('#trainHp').click(trainHp);
            hpTrainButtonRevealed = true;
        } else if (!atkTrainButtonRevealed && gs.training > 125) {
            $('#trainAtk')[0].style.display="inline";
            $('#trainAtk').click(trainAtk);
            atkTrainButtonRevealed = true;
        } else if (gs.training >= gs.trainingCap && gs.capRaiseRevealed) {
            gs.trainingCap = Math.round(trainingCap = gs.trainingCap * gs.capFactor);
            gs.training = 0;
            updateMainStory("Suddenly you feel a pulse and all of the coordination you had gained thus far drains out of you, but you feel like you have more potential.");
            pulseGently();
        }
}

function pulseGently() {
    updateMainStory('The item on your chest pulses gently once.');
    $('#amulet')[0].style.animation = "pulse 2s";
    setTimeout(function ()
    {
        $('#amulet')[0].style.animation = "";
    }, 2000);

}

function pulseStrongly() {
    updateMainStory('The item on your chest pulses strongly, something significant has changed.');
    $('#amulet')[0].style.animation = "pulse 5s";
    setTimeout(function ()
    {
        $('#amulet')[0].style.animation = "";
    }, 5000);
}

function incIntellect() {
    gs.intelligence += (gs.intelligenceInc * gs.intelligenceMult);
    if (gs.intelligence > gs.intelligenceCap) {
        gs.intelligence = gs.intelligenceCap;
    }
}

function autoIncIntellect() {
    if (gs.intelligenceAutoInc > 0) {
        gs.intelligence += gs.intelligenceAutoInc;
    }
    if (gs.intelligence > gs.intelligenceCap) {
        gs.intelligence = gs.intelligenceCap;
    }
}

function autoIncTraining() {
    if (gs.trainingAutoInc > 0) {
        gs.training += gs.trainingAutoInc;
    }
    if (gs.training > gs.trainingCap) {
        gs.training = gs.trainingCap;
    }
}

function basicAttackClick() {
    if (gs.training > basicAttackCost) {
        if (!inCombat) {
            updateActionFeedback("You practice your cool attack moves.");
        }
        didAttack=true;
        gs.training -=basicAttackCost;
        basicAttackExp++;
        trackTime();
    } else {
        alert('You must have at least ' + basicAttackCost + ' training to attack');
        return false;
    }
}

function runCombatRound() {
    if (didAttack) {
        updateMainStory("You swing at the " + mob.name + " hitting it with a weak attack for " + player.atk + " damage.");
        mob.hp -= player.atk;
        if (mob.hp <= 0) {
            updateMainStory("The " + mob.name + " falls to the ground dead.");
            combatRewards();
            inCombat = false;
            return true;
        }
    }
    didAttack = false;
    updateMainStory("The " + mob.name + " swings at you dealing " + mob.atk + " damage!");
    player.hp -= mob.atk;
    if (player.hp <= 0) {
        updateMainStory("You have been slain by " + mob.name);
        inCombat = false;
        return false;
    }
    return true;

}

function combatRewards() {
    checkSpecialCombatRewards();
}

function checkSpecialCombatRewards() {
    if (firstCombatEngaged) {
        firstCombatWon = true;
        updateMainStory("Upon striking down this Strange Creature all of your surroundings twist and distort, and your amulet pulses strongly");
        pulseStrongly();
        updateMainStory("The creatures eyes, red a moment ago flash to a warm light orange color.  Suddenly the light in the eyes shoots out of the creature and move unerringly towards the amulet on your chest. ");
        updateMainStory("A voice sounds off in your head: 'At last!  We are united once again!'");
        updateMainStory("Suddenly you know, this creature was the 'Spirit of Creativity' and its a part of you.  You remember waking up in another room similar to this and knowing that the 'Spirit of Last Resort' was in danger.");
        updateMainStory("For some strange reason though none of the other spirits appear reachable via the subnet so you cannot request aid.  Determined to not let the spirit die you decided to set out and try to intercept whatever was heading towards it.");
        updateMainStory("About halfway to the 'Node of Last Resort' you ran into a fellow spirit also on the way to the node, perhaps they also saw the problem and are heading to help too?");
        updateMainStory("Encouraged, you call out and the spirit turns.  Only then do you see the crackling red eyes streaked with black bolts of energy.  The spirit moves, almost too fast too see, and suddenly everything goes black.");
        clearCombatInfo();
    }
}

function trackTime() {

    // FIre the auto inc's
    autoIncTraining();
    autoIncIntellect();

    // Check for stat unlocks!
    checkIntelligenceUnlocks()
    checkTrainingUnlocks();

    // Level Up Combat Skills
    levelUpCombatSkills();

    // Are we in combat?
    if (inCombat) {
        updateCombatInfo();
        if (!runCombatRound()) {
            resetPhase1();
            clearCombatInfo();
        }
    }

    // Post player driven actions, does something happen to them?
    checkFirstCombat();
    if (gs.tick >= 50) {
        updateMainStory("Another spirit comes through the door of the room, eyes burning a fearsome red with ominous black streaks running through them.");
        updateMainStory("Almost too fast to see, it strikes at you piercing your chest.  In horror you watch the blackness seep from its eyes at head towards you engulfing your body from within.");
        inCombat=false;
        resetPhase1();
    }

    // This is now centralized and will be called each tick
    gs.tick++;
    decorateToolTips();
}

function checkFirstCombat() {
    if (!firstCombatWon) {
        if (!firstTimeMessage && gs.tick >= 10) {
            updateMainStory('You hear soft pounding on the door, the creature has arrived');
            firstTimeMessage = true;
        } else if (!secondTimeMessage && gs.tick >= 15) {
            updateMainStory('The banging on the door has become very loud, the creature is almost inside');
            secondTimeMessage = true;
        } else if (!firstCombatWon && gs.tick >=25) {
            // Check stats/abilities either overcome creature and goto phase 2, or reset allowing level up.
            if (!combatSkillsRevealed) {
                if (gs.intelligence < 100 && gs.training < 100) {
                    updateMainStory('The creature bursts into the room, and finishes you off just like before.');
                } else if (gs.intelligence < 100) {
                    updateMainStory('The creature bursts into the room, and comes for you.  You are able to dodge its attacks initially, but it is more seasoned than you and eventually corners and kills you.');
                } else if (gs.training < 100) {
                    updateMainStory('The creature bursts into the room, and starts to come after you.  You however anticipate its attack patterns and hold out for a while.  Unfortunately you do not have the stamina to fight back and eventually the creature wears you down and kills you.');
                }
            }

            // Succeed or die.
            if ((gs.training >= 100 && gs.intelligence >= 100) || combatSkillsRevealed) {
                    mob = getMonster(...shardBosses[0]);
                    inCombat=true;
                    updateActionFeedback("Seeing no other way, you fight the creature.");
                    if (!combatSkillsRevealed) {
                        updateMainStory("Basic attack skill unlocked!  This skill will be permanently unlocked for future loops so you can train with it before the creature arrives.");
                        combatSkillsRevealed = true;
                        $('#combatActions')[0].style.display="inline";
                        $('#enemyStats')[0].style.display="block";
                        firstCombatEngaged=true;
                    }
                    updateCombatInfo();
            } else {
                    resetPhase1();
            }
        }
    }
}

function updateCombatInfo() {
    $('#opponentName')[0].innerHTML = mob.name;
    $('#combatStatus')[0].innerHTML = "Engaged";
};

function clearCombatInfo() {
    $('#opponentName')[0].innerHTML = "No Opponent";
    $('#combatStatus')[0].innerHTML = "Free";
}

function levelUpCombatSkills() {
    if (basicAttackExp >= basicAttackLevelUpCost) {
        pulseGently();
        updateMainStory("You have become more efficient at attacking! (Action Cost Decrease/Level Up Increase)");
        basicAttackLevelUpCost = Math.round(basicAttackLevelUpCost *= 1.5);
        basicAttackExp = 0;
        basicAttackCost = Math.round(basicAttackCost *= .9);
    }
}

function resetPhase1() {

    // Scores
    resetAbilityScores();

    // Tick messages
    resetTickMessages();
    gs.tick = 0;

    gs.deaths++;
    // Death based upgrades go here
    unlockDeathUpgrades();

    decorateToolTips();
    updateActionFeedback('You have died!  The item on your chest flashes a brilliant blue and you stream back to the start of your loop!');

    if(firstCombatWon && !firstCombatUnlocksRevealed) {
        updateMainStory('This time when you come to, something has changed.  One of the panels that lines the wall of your room has come alive.  Circular Pattern on it with 12 circles spread around the diameter, one of the circles, the one to the north is lit up and is colored a warm light orange. Additionally there is one larger circle in the middle colored a pleasing light blue.');
        updateMainStory("You realize that there is also writing on the panel, and you can actually understand it.  The words say 'Subnet Status'");
        updateMainStory("Oddly, you appear to also know what's going on in the other location, and it appears that it is currently letting you know that a threat is approaching your location, and will most likely arrive in 50 ticks.");
        updateMainStory("Additionally you also seem to have access to new skills, which should in turn open up new ways to deal with incoming threats.");
        firstCombatUnlocksRevealed = true;
    }
};

function revealDeathStat() {
    $('#deathStat')[0].style.display="block";
}

function unlockDeathUpgrades() {
    if (!gs.deathStatRevealed && gs.deaths >= 10) {
        updateMainStory('As you die you notice that the pulse coming from your chest is getting a bit stronger each time.  When you come back to you notice that some of the blue light that has come from it is absorbed back in, causing the glow to become slightly stronger over the cycles.  You are not sure what use this is for you, bit you think you can estimate how large the effect is from here onward.');
        pulseStrongly();
        gs.deathStatRevealed=true;
    }
}

function resetTickMessages() {
    firstTimeMessage = false;
    secondTimeMessage = false;
}

function resetAbilityScores() {
    gs.intelligence = 0;
    updateIntelligence();
    gs.training = 0;
    player.hp=player.totalHp;
    hasAwardedTrainingIncCap = false;
    hasAwardedIntelligenceIncCap = false;
    updateTraining(gs.training);
}

function incTraining() {
    gs.training = gs.training + (gs.trainingInc * gs.trainingMult);
    if (gs.training > gs.trainingCap) {
        gs.training = gs.trainingCap;
    }
}

function updateTraining() {
    $('#trainingValue')[0].innerHTML = gs.training;
}

function updateIntelligence() {
    document.getElementById('intelligenceValue').innerHTML = gs.intelligence;
}

function updateActionFeedback(message) {
    document.getElementById('actionFeedback').value = message;
}

function updateMainStory(message) {
    document.getElementById('mainStory').value += '\n' + message;
    $('#mainStory').scrollTop($('#mainStory')[0].scrollHeight);
}

function getMonster(name, hp, atk, baseScrap) {
    return {
        name,
        hp,
        atk,
        baseScrap
    }
}

function save() {
    store.set("player", player)
    store.set("gameState", gs);
    return true;
}

function load() {
    player = store.get("player");
    // Take care of strange
    let saveState = store.get("gameState");
    if (saveState != null) {
        Object.assign(gs, store.get("gameState"));
    } else { return false }
    finishTutorial();
    processUnlocks();
    decorateToolTips();
    return true;
}

function processUnlocks() {
    if (gs.capsRevealed) {
        revealCaps();
    }
    if (gs.incRevealed) {
        revealInc();
    }
    if (gs.combatRevealed) {
        revealCombat();
    }
    if (gs.deathStatRevealed) {
        revealDeathStat();
    }
}

$( document ).ready(function() {
    $('#look').click(lookAction);
    $('#versionNumber')[0].innerHTML = 'Version: ' + versionNumber;
    $('#basicAttack').click(basicAttackClick);
    if (confirm("Load your saved game?")) {load()}
});
