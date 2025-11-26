export const AsciiStyles = {
  headerCat: `
    /\\_____/\\
   /  o   o  \\
  ( ==  ^  == )
   )         (
  (           )
 ( (  )   (  ) )
(__(__)___(__)__)
`,

  footerCat: `
 _._     _,-'""\`-._
(,-.\`._,'(       |\\\`-/|
    \`-.-' \\ )-\`( , o o)
          \`-    \\\`_\`"'-
`,

  helloWorldCat: `
               _ |\\_
               \\\` ..\\
          __,.-" =__Y=
        ."        )
  _    /   ,    \\/\\_
 ((____|    )_-\\ \\\`-'
 \`-----'\`-----\` \`--\`
`,

  moon: `
          _.._
        .' .-'\`
       /  /
       |  |
       \\  '.___.;
        '._  _.'
           \`\`
`,

  sun: `
        .
      \\ | /
    '-.;;;.-'
   -==;;;;;==-
    .-';;;'-.
      / | \\
        '
`,

  box: (text: string) => {
    const content = ` ${text} `;
    const width = content.length;
    const top = '+' + '-'.repeat(width) + '+';
    const middle = '|' + content + '|';
    const bottom = '+' + '-'.repeat(width) + '+';

    return `${top}\n${middle}\n${bottom}`;
  },

  button: (text: string) => `[ ${text} ]`,
};