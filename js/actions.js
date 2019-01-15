// Version number
var versionNumber = '0.32.31.8';

// Awareness Intro Game Stat
var isAware = true;
var awareness = 0;
var tutorial = 0;

var mob;

var player = {
    hp: 1,
    totalHp: 1,
    atk: 1
};

var gs = {
    // revealStates
    capsRevealed: false,
    incRevealed: false,
    capRaiseRevealed: false,
    combatRevealed: false,
    deathStatRevealed: false,
    hpTrainButtonRevealed: false,
    atkTrainButtonRevealed: false,
    autoIncTrainingRevealed: false,
    combatSkillsRevealed: false,
    firstCombatUnlocksRevealed: false,
    scrapRevealed: false,
    essenceRevealed: false,
    automationRevealed: false,

    // scrap
    scrap: 0,
    scrapCap: 50,

    // Essence
    essence: 0,
    essenceCap: 50,

    // death
    deaths: 1,
    deathInc: 1,

    // Base factors
    capFactor: 1.5,

    // research
    temporalResearch: 0,
    temporalResearchCap: 1000,
    temporalResearchLevel: 1,

    // Stats Economy
    intelligence: 0,
    intelligenceCap: 100,
    intelligenceAutoInc: 0,
    intelligenceInc: 1,
    intelligenceMult: 1,
    intelligenceRobot: 0,
    intelligenceRobotCap: 5,

    // unleash the robots, so many robots.
    baseRobotCost: 25,

    automateIntRevealed: false,
    automateIntCost: 25,
    automatonsInt: 0,

    automateTrainingRevealed: false,
    automateTrainingCost: 25,
    automatonsTraining: 0,

    automateTinkeringRevealed: false,
    automateTinkeringCost: 25,
    automatonsTinkering: 0,

    automateScavengingRevealed: false,
    automateScavengingCost: 25,
    automatonsScavenging: 0,

    // kill stats
    bossesKilled: 1,
    monstersKilled: 0,

    training: 0,
    trainingAutoInc: 0,
    trainingMult: 1,
    trainingInc: 1,
    trainingCap: 100,
    trainingRobot: 0,
    trainingRobotCap: 5,

    tinkering: 0,
    tinkeringAutoInc: 0,
    tinkeringMult: 1,
    tinkeringInc: 1,
    tinkeringCap: 100,
    tinkeringRobot: 0,
    tinkeringRobotCap: 5,

    scavenging: 0,
    scavengingAutoInc: 0,
    scavengingMult: 1,
    scavengingInc: 1,
    scavengingCap: 100,
    scavengingRobot: 0,
    scavengingRobotCap: 0,

    // Time
    tick: 0,
    firstCombatEngaged: false,
    firstCombatWon: false,
    hasAwardedIntelligenceIncCap: false,
    hasAwardedTrainingIncCap: false,
    hasAwardedTinkeringIncCap: false,
    hasAwardedScavengingIncCap: false,
    firstTimeMessage: false,
    secondTimeMessage: false,
    inCombat: false,
    didAttack: false,
    basicAttackExp: 0,
    basicAttackLevelUpCost: 10,
    basicAttackCost: 150
};



var shardBosses = [];
shardBosses.push(["Strange Creature", 10, 5, 1, 0]);

// Random Encounters Phase1
var randomEncountersArray = [];
randomEncountersArray.push(["Smashed Humanoid", 12, 2, 1, 0]);
randomEncountersArray.push(["Smashed Humanoid", 20, 2, 1, 0]);
randomEncountersArray.push(["Damaged Humanoid", 12, 8, 1, 0]);
randomEncountersArray.push(["Smashed Humanoid", 12, 2, 1, 0]);
randomEncountersArray.push(["Smashed Humanoid", 12, 3, 1, 0]);
randomEncountersArray.push(["Smashed Hulking Humanoid", 17, 2, 1, 0]);
randomEncountersArray.push(["Small Scavenger", 10, 6, 0, 1]);
randomEncountersArray.push(["Small Scavenger", 6, 9, 0, 1]);
randomEncountersArray.push(["Small Vicious Scavenger", 7, 16, 0, 1]);
randomEncountersArray.push(["Hunting Humanoid", 26, 12, 3, 1]);



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
    document.getElementById('train').style.display='block';
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

function trainAutoTinkeringInc() {
    if (gs.deaths < 10) {
        alert('You need more temporal energy to train this stat');
        return false;
    } else {
        gs.deaths -= 10;
        gs.tinkeringAutoInc++;
        updateActionFeedback('You channel temporal energy towards your training time, old you is helping new you be more creative');
        trackTime();
    }
}

function trainAutoScavengingInc() {
    if (gs.deaths < 10) {
        alert('You need more temporal energy to train this stat');
        return false;
    } else {
        gs.deaths -= 10;
        gs.scavengingAutoInc++;
        updateActionFeedback('You channel temporal energy towards your training time, old you is helping new you be more resourceful');
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

function tinkeringAction() {
    incStat('tinkering');
    updateActionFeedback('You tinker around with the scrap in the room.');
    trackTime();
}

function scavengingAction() {
    incStat('scavenging');
    updateActionFeedback('You scavenge around the room for parts you can use, trying to learn to be more efficient in their application.');
    trackTime();
}

function lookPhase1() {
    //incIntellect();
    incStat('intelligence');
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

function checkTinkeringUnlocks() {
    if (!gs.hasAwardedTinkeringIncCap && gs.tinkering >= 10 && gs.tinkeringInc < 10) {
        gs.tinkeringInc++;
        gs.hasAwardedTinkeringIncCap = true;
        updateActionFeedback('Messing around with the items in the room leads you to a deeper understanding of how they work. (+1 Tinkering per Click)');
        pulseGently();
    } else if (gs.tinkering > 25 && !gs.automationRevealed) {
        gs.automationRevealed=true;
        updateMainStory("Looking at all of the scrap lying around you think that you might be able to get some of the robots working again if you had enough Vitae and scrap.");
        pulseStrongly();
        updateMainStory("Suddenly the wall on the opposite side of the door turns translucent, and you see images of yourself doing various tasks. ");
        updateMainStory('You hear what you think is your own human voice coming from the amulet: "Temporal Automation is the key to me accomplishing my goal.  If I study a task long enough I should be able to create a robot to perform it for me in a micro time loop."');
        updateMainStory('"Unfortunately I\'ve never been able to collect enough temporal energy to put it in practice so far, but when I can this will be absolutely invaluable to me.');
        updateMainStory('"I\'ve created this temporal interface to drive this experiment forward, wish me luck Sophia."');
        updateMainStory('With that the voice stops speaking and numbers appear on the screen, perhaps this is the required amount of temporal energy to complete the task?  This is going to be expensive as hell, but you can\'t help but wonder if its worth trying out.');
        revealAutomation();
        updateMainStory("The panel has an angry red message across the top of it: Temporal Emergency Event Detected, micro loops have collapsed and are unrecoverable, do you want to clear temporal pointers?");
        updateMainStory("With little real idea of what's going on you press what you think is the confirmation button.  Blue light flashes in the room, and now the screen is replaced with a interface labeled 'Temporal Automation System Core (TASC)'");
    } else if (gs.tinkering >= gs.tinkeringCap) {
                    gs.tinkeringCap = Math.round(gs.tinkeringCap = gs.tinkeringCap * gs.capFactor);
                    gs.tinkering = 0;
                    updateMainStory("Suddenly you realize everything up until now that you have created was just garbage.  Armed with this knowledge you start again determined to do better.");
                    pulseGently();
    }
}

function checkScavengingUnlocks() {
    if (!gs.hasAwardedScavengingIncCap && gs.scavenging >= 10 && gs.scavengingInc < 10) {
        gs.scavengingInc++;
        gs.hasAwardedScavengingIncCap = true;
        updateActionFeedback('You hunt around in the wreckage of the room, getting more adept at finding useful items in the area. (+1 Scavenging per Click)');
        pulseGently();
    } else if (gs.scavenging > 25 && !gs.scrapRevealed) {
        gs.scrapRevealed = true;
        updateMainStory('Thinking about the robotic monsters you are encountering, you idly wonder if you could harvest their parts.');
        pulseStrongly();
        updateMainStory('Suddenly one of the panels on the wall stats to glow blue.  Lettering flows on the screen reading the following:');
        updateMainStory('Experimental Material Storage:');
        updateMainStory('Scrap 0/50');
        updateMainStory("");
        updateMainStory("");
        updateMainStory('Now your amulet emits a voice: "Storage Room online, materials recognized as useful will automatically transfer via temporal interface."');
        revealScrap();
    } else if (gs.scavenging > 75 && !gs.essenceRevealed) {
        gs.essenceRevealed = true;
        updateMainStory('One of the non robotic monsters corpses shudders and twitches on the floor.');
        updateMainStory('Suddenly you think to yourself, "Why am I letting this Life Essence go to waste, I should be draining my foes after I kill them"');
        updateMainStory('Horrified at this sudden thought, you are even more distressed when your amulet pulses in response.');
        pulseStrongly();
        updateMainStory("A voice speaks from the amulet: Vitae storage online");
        revealEssence();
    } else if (gs.scavenging >= gs.scavengingCap) {
        gs.scavengingCap = Math.round(gs.scavengingCap = gs.scavengingCap * gs.capFactor);
        gs.scavenging = 0;
        updateMainStory("You realize that you haven't even really begun to find all of the things your fallen foes could do for you.  While this means you need to start looking through the remains again, you feel like you will do a better job this time.");
        pulseGently();
    }
}

function revealEssence() {
    $('#essenceStats')[0].style.display="inline";
}

function revealScrap() {
    $('#scrapStats')[0].style.display="inline";
}

function checkIntelligenceUnlocks () {
    if (!gs.hasAwardedIntelligenceIncCap && gs.intelligence >= 10 && gs.intelligenceInc < 10) {
        gs.intelligenceInc++;
        gs.hasAwardedIntelligenceIncCap = true;
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
    } else if (gs.intelligence > 150 && gs.deathStatRevealed && !gs.autoIncTrainingRevealed) {
        pulseStrongly();
        updateMainStory("Thinking about all of this temporal energy you are gaining you wonder if you could somehow take some of the time you are spending training each cycle into the next cycle.");
        updateMainStory("You think it should be possible, and almost on cue a panel lights up on the side of the room, glowing the same blue color that your chest does. ");
        updateMainStory("On the panel is an interface, with multiple buttons.  These buttons seem to correspond to activities you have been doing.");
        gs.autoIncTrainingRevealed=true;
        revealAutoIncTraining();
    }
    else if (gs.intelligence >= gs.intelligenceCap  && gs.capRaiseRevealed) {
        gs.intelligenceCap = Math.round(gs.intelligenceCap = gs.intelligenceCap * gs.capFactor);
        gs.intelligence = 0;
        updateMainStory("Suddenly you feel a pulse and all of the knowledge you had gained thus far drains out of you, but you feel like you have more potential.");
        pulseGently();
    }
}

function revealAutoIncTraining() {
    $('#intelligenceAutoIncContainer')[0].style.display="inline";
    $('#trainingAutoIncContainer')[0].style.display="inline";
    $('#trainAutoIntelligenceInc').click(trainAutoIntInc);
    $('#trainAutoTrainingInc').click(trainAutoTrainingInc);
}

function decorateToolTips() {
    decorateStat('intelligence');
    decorateStat('training');
    $('#tickValue')[0].innerHTML = gs.tick;
    if (gs.combatRevealed) {
        $('#hpValue')[0].innerHTML='' + player.hp + '/' + player.totalHp;
        $('#atkValue')[0].innerHTML=player.atk;
    }
    if (gs.deathStatRevealed) {
        $('#deathValue')[0].innerHTML=gs.deaths;
    }
    if (gs.combatSkillsRevealed) {
        $('#basicAttackCost')[0].innerHTML=gs.basicAttackCost;
        $('#basicAttackTNL')[0].innerHTML=gs.basicAttackExp + '/' + gs.basicAttackLevelUpCost;
    }
    if (gs.firstCombatUnlocksRevealed) {
        //$('#tinkeringValue')[0].innerHTML = gs.tinkering;
        decorateStat('tinkering');
        decorateStat('scavenging');
    }
    if (gs.scrapRevealed) {
        decorateCapStat('scrap')
    }
    if (gs.essenceRevealed) {
       decorateCapStat('essence');
    }
    if (gs.fRevealed) {
        decorateCapStat('temporalResearch');
    }
}

function temporalResearchAction() {
    updateActionFeedback('You put some thought into how to optimize your current workflow.');
    if (gs.intelligence > 0) {
        gs.temporalResearch += gs.intelligence;
        gs.intelligence = 0;
        if (gs.temporalResearch > gs.temporalResearchCap) {
            gs.temporalResearch = gs.temporalResearchCap;
        }
        trackTime();
    }
    return false;
}

function decorateCapStat(stat) {
    $('#'+stat+'Value')[0].innerHTML=gs[stat] + '/' + gs[stat+'Cap'];
}

function decorateStat(stat) {
    $('#'+stat+'Value')[0].innerHTML = gs[stat];
    $('#'+stat+'Cap')[0].innerHTML=gs[stat+'Cap'];
    $('#'+stat+'Inc')[0].innerHTML=gs[stat+'Inc'];
    $('#'+stat+'AutoInc')[0].innerHTML=gs[stat+'AutoInc'];
}

function trainPhase1() {
    //incTraining();
    incStat('training');
    updateActionFeedback('You attempt to figure out how to move around in this body more effectively');
    trackTime();
}

function revealCombat() {
    $('#combat')[0].style.display="block";
}

function checkTrainingUnlocks () {
        if (!gs.hasAwardedTrainingIncCap && gs.training >= 10 && gs.trainingInc < 10) {
            gs.trainingInc++;
            gs.hasAwardedTrainingIncCap = true;
            updateActionFeedback('You work on controlling your various limbs, trying to use it as effectively as the your own body. (+1 Training per click)');
            pulseGently();
        } else if (!gs.combatRevealed && gs.training > 50) {
            gs.combatRevealed = true;
            revealCombat();
            updateMainStory('The more you move around the more sure that you become: You are going to have to fight this creature.  Its time to start thinking about how that will work.');
            pulseStrongly();
        } else if (!gs.hpTrainButtonRevealed && gs.training > 85) {
            revealHpTrainButton();
            gs.hpTrainButtonRevealed = true;
        } else if (!gs.atkTrainButtonRevealed && gs.training > 125) {
            revealAtkTrainButton();
            gs.atkTrainButtonRevealed = true;
        } else if (gs.training >= gs.trainingCap && gs.capRaiseRevealed) {
            gs.trainingCap = Math.round(trainingCap = gs.trainingCap * gs.capFactor);
            gs.training = 0;
            updateMainStory("Suddenly you feel a pulse and all of the coordination you had gained thus far drains out of you, but you feel like you have more potential.");
            pulseGently();
        }
}

function revealHpTrainButton() {
    $('#trainHp')[0].style.display="inline";
    $('#trainHp').click(trainHp);
}

function revealAtkTrainButton() {
    $('#trainAtk')[0].style.display="inline";
    $('#trainAtk').click(trainAtk);
}

function pulseGently() {
    updateMainStory('The item on your chest pulses gently once.');
}

function pulseStrongly() {
    updateMainStory('The item on your chest pulses strongly, something significant has changed.');
}

function incStat(stat) {
    gs[stat] += (gs[stat+'Inc'] * gs[stat+'Mult']);
    if (gs[stat] > gs[stat+'Cap']) {
        gs[stat] = gs[stat+'Cap'];
    }
}

function autoIncStat(stat) {
    if (gs[stat+'AutoInc'] > 0) {
        gs[stat] += gs[stat+'AutoInc'];
    }
    if (gs[stat] > gs[stat+'Cap']) {
        gs[stat] = gs[stat+'Cap'];
    }
}

function basicAttackClick() {
    if (gs.training > gs.basicAttackCost) {
        if (!gs.inCombat) {
            updateActionFeedback("You practice your cool attack moves.");
        }
        gs.didAttack=true;
        gs.training -=gs.basicAttackCost;
        gs.basicAttackExp++;
        trackTime();
    } else {
        alert('You must have at least ' + gs.basicAttackCost + ' training to attack');
        return false;
    }
}

function runCombatRound() {
    if (gs.didAttack) {
        updateMainStory("You swing at the " + mob.name + " hitting it with a weak attack for " + player.atk + " damage.");
        mob.hp -= player.atk;
        if (mob.hp <= 0) {
            updateMainStory("The " + mob.name + " falls to the ground dead.");
            combatRewards();
            gs.inCombat = false;
            return true;
        }
    }
    gs.didAttack = false;
    updateMainStory("The " + mob.name + " swings at you dealing " + mob.atk + " damage!");
    player.hp -= mob.atk;
    if (player.hp <= 0) {
        updateMainStory("You have been slain by " + mob.name);
        gs.inCombat = false;
        return false;
    }
    return true;

}

function revealBoss1Stats() {
        revealStatUI('tinkering','tinker');
        revealStatUI('scavenging','scavenge');
}

function revealStatUI(stat, actionName) {
    $('#'+stat+'Stat')[0].style.display="";
    $('#'+actionName+'')[0].style.display="";
}



function trackTime() {

    // FIre the auto inc's
    autoIncStat('training');
    autoIncStat('intelligence');
    autoIncStat('tinkering');
    autoIncStat('scavenging');

    // Check for stat unlocks!
    checkIntelligenceUnlocks()
    checkTrainingUnlocks();
    checkTinkeringUnlocks();
    checkScavengingUnlocks();

    // Level Up Combat Skills
    levelUpCombatSkills();

    // Are we in combat?
    if (gs.inCombat) {
        updateCombatInfo();
        if (!runCombatRound()) {
            resetPhase1();
            clearCombatInfo();
        }
    } else if (gs.firstCombatWon && gs.tick > 15) {
        randomEncounters();
    }

    // Post player driven actions, does something happen to them?
    checkFirstCombat();
    if (gs.tick >= 50) {
        updateMainStory("Another spirit comes through the door of the room, eyes burning a fearsome red with ominous black streaks running through them.");
        updateMainStory("Almost too fast to see, it strikes at you piercing your chest.  In horror you watch the blackness seep from its eyes at head towards you engulfing your body from within.");
        gs.inCombat=false;
        resetPhase1();
    }

    // This is now centralized and will be called each tick
    gs.tick++;
    decorateToolTips();
}

function randomEncounters() {
    if (Math.floor((Math.random() * 100) + 1) <= 15) {
        mob = getMonster(...randomEncountersArray[Math.floor((Math.random() * randomEncountersArray.length))]);
        updateCombatInfo();
        runCombatIntro();
        gs.inCombat = true;
        return true;
    }
    return false;
}

function checkFirstCombat() {
    if (!gs.firstCombatWon) {
        if (!gs.firstTimeMessage && gs.tick >= 10) {
            updateMainStory('You hear soft pounding on the door, the creature has arrived');
            gs.firstTimeMessage = true;
        } else if (!gs.secondTimeMessage && gs.tick >= 15) {
            updateMainStory('The banging on the door has become very loud, the creature is almost inside');
            gs.secondTimeMessage = true;
        } else if (!gs.firstCombatWon && gs.tick >=25) {
            // Check stats/abilities either overcome creature and goto phase 2, or reset allowing level up.
            if (!gs.combatSkillsRevealed) {
                if (gs.intelligence < 100 && gs.training < 100) {
                    updateMainStory('The creature bursts into the room, and finishes you off just like before.');
                    resetPhase1();
                } else if (gs.intelligence < 100) {
                    updateMainStory('The creature bursts into the room, and comes for you.  You are able to dodge its attacks initially, but it is more seasoned than you and eventually corners and kills you.');
                    resetPhase1();
                } else if (gs.training < 100) {
                    updateMainStory('The creature bursts into the room, and starts to come after you.  You however anticipate its attack patterns and hold out for a while.  Unfortunately you do not have the stamina to fight back and eventually the creature wears you down and kills you.');
                    resetPhase1();
                }
            }

            // Succeed or die.
            if (( gs.training >= 100 && gs.intelligence >= 100) || (gs.combatSkillsRevealed && !gs.inCombat)) {
                    mob = getMonster(...shardBosses[0]);
                    runCombatIntro();
                    gs.inCombat=true;
                    updateActionFeedback("Seeing no other way, you fight the creature.");
                    if (!gs.combatSkillsRevealed) {
                        updateMainStory("Basic attack skill unlocked!  This skill will be permanently unlocked for future loops so you can train with it before the creature arrives.");
                        gs.combatSkillsRevealed = true;
                        gs.firstCombatEngaged=true;
                        revealCombatSkills();
                    }
                    updateCombatInfo();
            }
        }
    }
}

// Combat Functions

function combatRewards() {
    if (gs.scrapRevealed) {
        awardLoot('scrap', mob.baseScrap);
    }
    if (gs.essenceRevealed) {
        awardLoot('essence', mob.baseNecroEnergy);
    }
    gs.didAttack = false;
    gs.monstersKilled++;
    checkSpecialCombatRewards();
}

function awardLoot(type, amount) {
    if (amount != 0) {
        if (gs[type] <= gs[type+'Cap']) {
            gs[type] += amount;
            if (gs[type] > gs[type+'Cap']) {
                gs[type] == gs[type+'Cap'];
                updateMainStory("Your " + type + " storage now full.");
            } else {
                updateMainStory(amount + " " + type + " deposits into storage.");
            }
        } else {
            updateMainStory("Your " + type + " storage is already full.");
        }
    }
}

function checkSpecialCombatRewards() {
    if (gs.firstCombatEngaged && !gs.firstCombatWon) {
        gs.firstCombatWon = true;
        updateMainStory("Upon striking down this Strange Creature all of your surroundings twist and distort, and your amulet pulses strongly");
        pulseStrongly();
        updateMainStory("The creatures eyes, red a moment ago flash to a warm light orange color.  Suddenly the light in the eyes shoots out of the creature and move unerringly towards the amulet on your chest. ");
        updateMainStory("A voice sounds off in your head: 'At last!  We are united once again!'");
        updateMainStory("Suddenly you know, this creature was the 'Spirit of Creativity' and its a part of you.  You remember waking up in another room similar to this and knowing that the 'Spirit of Last Resort' was in danger.");
        updateMainStory("For some strange reason though none of the other spirits appear reachable via the subnet so you cannot request aid.  Determined to not let the spirit die you decided to set out and try to intercept whatever was heading towards it.");
        updateMainStory("About halfway to the 'Node of Last Resort' you ran into a fellow spirit also on the way to the node, perhaps they also saw the problem and are heading to help too?");
        updateMainStory("Encouraged, you call out and the spirit turns.  Only then do you see the crackling red eyes streaked with black bolts of energy.  The spirit moves, almost too fast too see, and suddenly everything goes black.");
        updateMainStory("");
        updateMainStory("");
        updateMainStory("");
        updateMainStory("When you come back to your senses you see the last of the orange light absorb into your necklace.  Its over now.");
        updateMainStory("But just then a lance of the angry red light shoots out from the scraps of the creature and strike the ruined door.  The world again distorts and shifts, but afterwards the red light fades away.");
        clearCombatInfo();
    }
}

function revealCombatSkills() {
    $('#combatActions')[0].style.display="inline";
    $('#enemyStats')[0].style.display="block";
}

function updateCombatInfo() {
    $('#opponentName')[0].innerHTML = mob.name;
    $('#combatStatus')[0].innerHTML = "Engaged";
    $('#combatStatus')[0].classList.add("bg-danger");
};

function runCombatIntro() {
    updateMainStory("A " + mob.name + " comes crashing through the door!");
}

function clearCombatInfo() {
    $('#opponentName')[0].innerHTML = "No Opponent";
    $('#combatStatus')[0].innerHTML = "None";
    $('#combatStatus')[0].classList.remove("bg-danger");
}

function levelUpCombatSkills() {
    if (gs.basicAttackExp >= gs.basicAttackLevelUpCost) {
        pulseGently();
        updateMainStory("You have become more efficient at attacking! (Action Cost Decrease/Level Up Increase)");
        gs.basicAttackLevelUpCost = Math.round(gs.basicAttackLevelUpCost *= 1.5);
        gs.basicAttackExp = 0;
        gs.basicAttackCost = Math.round(gs.basicAttackCost *= .9);
    }
}

function resetPhase1() {

    // Scores
    resetAbilityScores();

    // Tick messages
    resetTickMessages();
    gs.tick = 0;

    gs.deaths += (1 * gs.bossesKilled);
    // Death based upgrades go here
    unlockDeathUpgrades();

    decorateToolTips();
    updateActionFeedback('You have died!  The item on your chest flashes a brilliant blue and you stream back to the start of your loop!');

    if(gs.firstCombatWon && !gs.firstCombatUnlocksRevealed) {
        updateMainStory('This time when you come to, something has changed.  One of the panels that lines the wall of your room has come alive. There is a Circular Pattern on it with 12 circles spread around the diameter, one of the circles, the one to the north is lit up and is colored a warm light orange. Additionally there is one larger circle in the middle colored a pleasing light blue.');
        updateMainStory("You realize that there is also writing on the panel, and you can actually understand it.  The words say 'Subnet Status: Station Creation Online'");
        updateMainStory("Somehow also you know that a threat is approaching your location, and will most likely arrive in 50 ticks.");
        updateMainStory("You also seem to have access to new skills, which should in turn open up new ways to deal with incoming threats.");
        updateMainStory("Unfortunately the damage to your door remains, and you are now vulnerable to attack from the outside.  Its probably time to prepare for the next creature coming your way.");
        gs.firstCombatUnlocksRevealed = true;
        gs.bossesKilled++;
        revealBoss1Stats();
    }
};

function revealDeathStat() {
    $('#deathStat')[0].style.display="";
}

function unlockDeathUpgrades() {
    if (!gs.deathStatRevealed && gs.deaths >= 10) {
        updateMainStory('As you die you notice that the pulse coming from your chest is getting a bit stronger each time.  When you come back to you notice that some of the blue light that has come from it is absorbed back in, causing the glow to become slightly stronger over the cycles.  You are not sure what use this is for you, bit you think you can estimate how large the effect is from here onward.');
        pulseStrongly();
        gs.deathStatRevealed=true;
        revealDeathStat();
    }
}

function resetTickMessages() {
    gs.firstTimeMessage = false;
    gs.secondTimeMessage = false;
}

function resetAbilityScores() {
    gs.intelligence = 0;
    gs.training = 0;
    gs.tinkering = 0;
    gs.scavenging = 0;
    player.hp=player.totalHp;
    gs.hasAwardedTrainingIncCap = false;
    gs.hasAwardedIntelligenceIncCap = false;
    gs.hasAwardedScavengingIncCap = false;
    gs.hasAwardedTinkeringIncCap = false;
}

function updateActionFeedback(message) {
    document.getElementById('actionFeedback').value = message;
}

function updateMainStory(message) {
    document.getElementById('mainStory').value += '\n' + message;
    $('#mainStory').scrollTop($('#mainStory')[0].scrollHeight);
}

/** Central function for building robots **/

function revealAutomation() {
    $('#automationActions')[0].style.display="block";
    $('#automateInt').click(buildAutomaton('Int'));
    $('#automateTraining').click(buildAutomaton('Training'));
    $('#automateTinkering').click(buildAutomaton('Tinkering'));
    $('#automateScavenging').click(buildAutomaton('Scavenging'));
}

function buildAutomaton(param) {
    return function() {
                // syour code that does something with param
                // gs[stat] += (gs[stat+'Inc'] * gs[stat+'Mult']);
                var currentCost = gs.baseRobotCost * (gs['automatons'+param] + 1);
                alert(currentCost)
                if (gs.scrap < currentCost || gs.essence < currentCost) {
                    alert("Creating a robot costs 25 scrap and 25 essence as well as 150 tinkering");
                } else {
                    updateMainStory();
                    alert( param );
                }

           };
}

function getMonster(name, hp, atk, baseScrap, baseNecroEnergy) {
    return {
        name,
        hp,
        atk,
        baseScrap,
        baseNecroEnergy
    }
}

function save() {
    store.set("player", player)
    store.set("gameState", gs);
    store.set("mob", mob);
    updateActionFeedback("Game Saved.... ");
    return true;
}

function load() {
    let tempPlay = store.get("player");
    if (tempPlay != null) { Object.assign(player, tempPlay) } else { return false }

    let saveState = store.get("gameState");
    if (saveState != null) { Object.assign(gs, saveState) } else { return false }

    mob = store.get("mob")
    finishTutorial();
    processUnlocks();
    decorateToolTips();

    updateActionFeedback("Game loaded....");
    return true;
}

function hardReset() {
    if (confirm("Are you sure, this will completely erase your save and you will need to start over!")) {
        store.clearAll()
    };
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
    if (gs.hpTrainButtonRevealed) {
        revealHpTrainButton();
    }
    if (gs.atkTrainButtonRevealed) {
        revealAtkTrainButton();
    }
    if (gs.autoIncTrainingRevealed) {
        revealAutoIncTraining();
    }
    if (gs.combatSkillsRevealed) {
        revealCombatSkills();
    }
    if (gs.inCombat) {
        updateCombatInfo();
    }
    if (gs.firstCombatUnlocksRevealed) {
        revealBoss1Stats();
        if (gs.bossesKilled < 2) {
            gs.bossesKilled = 2;
        }
    }
    if (gs.scrapRevealed) {
        revealScrap();
    }
    if (gs.essenceRevealed) {
        revealEssence();
    }
    if (gs.automationRevealed) {
        revealAutomation();
    }
}

function toggleAutomation() {
    let panel = $('#automationPanel')[0];
    if (panel.style.display=="block") {
        panel.style.display="none";
    } else {
        panel.style.display="block";
    }
}

$( document ).ready(function() {
    $('#look').click(lookAction);
    $('#tinker').click(tinkeringAction);
    $('#scavenge').click(scavengingAction);
    $('#versionNumber')[0].innerHTML = 'Version: ' + versionNumber;
    $('#basicAttack').click(basicAttackClick);
    $('#saveGame').click(save);
    $('#loadGame').click(load);
    $('#hardReset').click(hardReset);
    $('#researchTemporal').click(temporalResearchAction);
    $('#tinkeringAutoTrainingInc').click(trainAutoTinkeringInc);
    $('#scavengingAutoTrainingInc').click(trainAutoScavengingInc);
    // Might go back to this
    //if (store.get("gameState") != null && confirm("Load your saved game?")) {load()}
    if (store.get("gameState") != null) {load()}
});
