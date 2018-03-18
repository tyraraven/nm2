
var curiosity = 0;

function testAlert() {
    if (curiosity < 5) {
        updateMainStory(phaseOneMessages[curiosity]);
        curiosity++;
    } else if (curiosity >= 3) {

    }
}

function updateMainStory(message) {
    document.getElementById('mainStory').value = message;
}
