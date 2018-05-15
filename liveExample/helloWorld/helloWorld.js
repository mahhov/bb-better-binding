let template = require('fs').readFileSync(`${__dirname}/helloWorld.html`, 'utf8');

let controller = source => {

    // greeting
    source.largeFont = 60;
    source.favoriteColor = 'DEEPpink';
    source.greeting = 'I hate you';
    source.name = 'World';
    source.exclamation = '(╯°□°）╯︵ ┻━┻';
    source.changeColor = input => {
        source.favoriteColor = input.value;
    };

    // animation
    let animations = [
        'http://www.qqpr.com/ascii/img/ascii-1043.gif',
        'https://media0.giphy.com/media/12EkJCbpa3hGKc/giphy.gif',
        'http://www.qqpr.com/ascii/img/ascii-1006.gif'];
    let animationIndex = -1;
    source.changeAnimation = () => {
        animationIndex = (animationIndex + 1) % animations.length;
        source.animation = animations[animationIndex];
    };
    source.changeAnimation();

    // jokes
    source.setJokeVisibility = checkbox => {
        source.jokeVisibility = checkbox.checked;
    };
    source.jokes = [
        {
            lines: [
                'Problem:  "Left inside main tire almost needs replacement."',
                'Solution: "Almost replaced left inside main tire."'
            ]
        }, {
            lines: [
                'Problem:  "Test flight OK, except autoland very rough."',
                'Solution: "Autoland not installed on this aircraft."'
            ]
        }, {
            lines: [
                'Problem #1:  "#2 Propeller seeping prop fluid."',
                'Solution #1: "#2 Propeller seepage normal."',
                'Problem #2:  "#1, #3, and #4 propellers lack normal seepage."'
            ]
        }, {
            lines: [
                'Problem:    "The autopilot doesn\'t."',
                'Signed off: "IT DOES NOW."'
            ]
        }, {
            lines: [
                'Problem:  "Something loose in cockpit."',
                'Solution: "Something tightened in cockpit."'
            ]
        }, {
            lines: [
                'Problem:  "Evidence of hydraulic leak on right main landing gear."',
                'Solution: "Evidence removed."'
            ]
        }, {
            lines: [
                'Problem:  "DME volume unbelievably loud."',
                'Solution: "Volume set to more believable level."'
            ]
        }, {
            lines: [
                'Problem:  "Dead bugs on windshield."',
                'Solution: "Live bugs on order."'
            ]
        }, {
            lines: [
                'Problem:  "Autopilot in altitude hold mode produces a 200 fpm descent."',
                'Solution: "Cannot reproduce problem on ground."'
            ]
        }, {
            lines: [
                'Problem:  "IFF inoperative."',
                'Solution: "IFF always inoperative in OFF mode."'
            ]
        }, {
            lines: [
                'Problem:  "Friction locks cause throttle levers to stick."',
                'Solution: "That\'s what they\'re there for."'
            ]
        }, {
            lines: [
                'Problem:  "Number three engine missing."',
                'Solution: "Engine found on right wing after brief search."'
            ]
        },
    ];
    source.jokesSource = 'https://www.netfunny.com/rhf/jokes/97/Jun/usaf.html';
};

module.exports = {template, controller};
