module.exports = source => {
    source.myMessage = 'whenever `source.myMessage` is modified, my text be updated to reflect the change';

    source.myFunction = (variable, string, integer, [string2, integer2]) =>
        `whenever \`source.myFunction\` or \`source.myVariable\` are modified, my text be updated to reflect the change; ${variable} ${string} ${integer} ${string2} ${integer2}`;

    source.myVariable = '-my variable is awesome-';

    source.mySpanMessage = '$s{x} is shorthand for &lt;span bind="x"&gt; &lt;/span&gt;';
};
