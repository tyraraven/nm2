// Awareness Intro Game Stat
var isAware = false;
var awareness = 0;
var tutorial = 0;
var training = 0;

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
            document.getElementById('train').style.display='block';
        }
        tutorial++;
    }
}

function trainAction() {
    incSenseOfSelf();
}

function incSenseOfSelf() {
    training++;
    document.getElementById('sosValue').innerHTML = training;
}

function updateMainStory(message) {
    document.getElementById('mainStory').value = message;
}
