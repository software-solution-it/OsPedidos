const fs = require('fs');
const path = require('path');

const corePath = path.resolve('./node_modules/@react-navigation/core/lib/commonjs/index.js');

try {
  let content = fs.readFileSync(corePath, 'utf8');
  
  if (content.includes('./theming/ThemeContext')) {
    content = content.replace('./theming/ThemeContext.js', './theming/ThemeContext');
    fs.writeFileSync(corePath, content);
    console.log('Fixed @react-navigation/core import issue');
  } else {
    console.log('No fix needed for @react-navigation/core');
  }
} catch (error) {
  console.error('Error fixing navigation:', error);
} 