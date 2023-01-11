import config from '@opengov/playwright-base/build/config';
import 'dotenv/config';

config.globalSetup =
  process.env.REUSE_SESSION === 'true'
    ? ''
    : require.resolve('./src/base/global-setup.ts');
const myArgs = process.argv.slice(2);
if (!(myArgs.indexOf('--grep') > -1)) {
  undefined !== process.env.GREP
    ? (config.grep = new RegExp(process.env.GREP))
    : '';
}
if (!(myArgs.indexOf('--grep-invert') > -1)) {
  undefined !== process.env.GREPINVERT
    ? (config.grepInvert = new RegExp(process.env.GREPINVERT))
    : '';
}
export default config;
