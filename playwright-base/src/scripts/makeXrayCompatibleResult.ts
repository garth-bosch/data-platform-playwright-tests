import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

if (
  fs.existsSync(
    path.join(process.cwd(), `../test-results/junit/junit-result.xml`),
  ) === false
) {
  throw Error(`No junit-result.xml file found!`);
}

const data = fs.readFileSync(
  path.join(process.cwd(), `../test-results/junit/junit-result.xml`),
);

if (data !== null) {
  const $ = cheerio.load(data, {
    xml: {
      xmlMode: true,
      withStartIndices: false,
    },
  });
  let testKey;
  $('testcase').each(function (i, elem) {
    const name = elem.attribs.name;
    for (const arr of name.split(' ')) {
      if (arr.includes('@OGT')) {
        testKey = arr
          .replace('@', '')
          .replace(/[\r\n]+/gm, '')
          .replace(',', '');
        $(elem).prepend(
          `<properties><property name="test_key" value= "${testKey}"/></properties>`,
        );
        break;
      }
    }
  });
  fs.writeFileSync(
    path.join(process.cwd(), `../test-results/junit/xray-junit-result.xml`),
    $.xml().replace(/<!--/g, '<!').replace(/(-->)/g, '>'),
  );
} else {
  throw Error(`junit-result.xml file has no content`);
}
