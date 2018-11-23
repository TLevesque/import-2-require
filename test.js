// const getAllIndexes = (arr, func) => {
//   let indexes = [];
//   arr.forEach((line, i) => {
//     if (func(line)) indexes.push(i);
//   });
//   return indexes;
// };

// const splitString = string => {
//   const trimString = string.trim();
//   const lineArr = trimString.split("\n").map(line => line.trim());
//   const importIndex = getAllIndexes(lineArr, line => line === "import {");
//   const fromIndex = getAllIndexes(
//     lineArr,
//     line =>
//       line.match(/} from/) && !line.match(/import {/) && !line.match(/, {/)
//   );
//   if (importIndex.length > 0 && fromIndex.length > 0) {
//     const indexList = importIndex
//       .map((importInd, i) => [importInd, fromIndex[i]])
//       .map(arr => {
//         const indexes = [];
//         let i = +arr[0];
//         while (i <= +arr[1]) {
//           indexes.push(i);
//           i++;
//         }
//         return indexes;
//       })
//       .reduce((prev, curr) => prev.concat(curr));
//     const arrays = importIndex
//       .map((index, i) => lineArr.slice(index, fromIndex[i] + 1))
//       .map(arr => arr.join(""));
//     lineArr.forEach((line, i) => {
//       if (!indexList.includes(i)) arrays.push(line);
//     });
//     return arrays;
//   } else {
//     return lineArr.filter(line => line.length !== 0);
//   }
// };

// const extractPath = string => {
//   const matchedText = string.match(/(\"|\')(.+?)(\"|\')/i);
//   return matchedText && matchedText[0].trim();
// };

// const extractName = string => {
//   const matchedText = string.match(/import(.*?)from/);
//   return matchedText && matchedText[1].trim();
// };

// const createRequireString = string => {
//   const path = extractPath(string);
//   const name = extractName(string);

//   if (string.length === 0) return;

//   if (
//     name &&
//     name.match(/\{/i) &&
//     name.match(/\}/i) &&
//     path &&
//     !path.match(/\.\//i)
//   ) {
//     const nameSring = string.match(/{(.+?)}/i)[1].trim();
//     const extraName =
//       string
//         .match(/import(.+?){/i)[1]
//         .trim()
//         .replace(",", "") ||
//       string
//         .match(/}(.+?)from/i)[1]
//         .trim()
//         .replace(",", "") ||
//       null;
//     if (nameSring.includes(",")) {
//       const names = nameSring.split(",").map(name => name.trim());
//       let returnedString = extraName
//         ? `const ${extraName} = require(${path});\n`
//         : "";
//       names.forEach((name, i) => {
//         if (name.includes("as")) {
//           const [originalName, newName] = name
//             .split(" as ")
//             .map(name => name.trim());
//           if (i === names.length - 1) {
//             returnedString = `${returnedString}const ${newName} = require(${path}).${originalName};`;
//           } else {
//             returnedString = `${returnedString}const ${newName} = require(${path}).${originalName};\n`;
//           }
//         } else {
//           if (i === names.length - 1) {
//             returnedString = `${returnedString}const ${name} = require(${path}).${name};`;
//           } else {
//             returnedString = `${returnedString}const ${name} = require(${path}).${name};\n`;
//           }
//         }
//       });
//       return returnedString;
//     } else {
//       if (nameSring.includes("as")) {
//         const [originalName, newName] = nameSring
//           .split("as")
//           .map(name => name.trim());
//         return extraName
//           ? `const ${extraName} = require(${path});\nconst ${newName} = require(${path}).${originalName};`
//           : `const ${newName} = require(${path}).${originalName};`;
//       } else {
//         return extraName
//           ? `const ${extraName} = require(${path});\nconst ${nameSring} = require(${path}).${nameSring};`
//           : `const ${nameSring} = require(${path}).${nameSring};`;
//       }
//     }
//   }

//   if (
//     name &&
//     name.match(/\{/i) &&
//     name.match(/\}/i) &&
//     path &&
//     path.match(/\.\//i)
//   ) {
//     const nameSring = string.match(/{(.+?)}/i)[1].trim();

//     if (nameSring && nameSring.includes(",")) {
//       const names = nameSring
//         .split(",")
//         .map(name => name.trim())
//         .filter(name => name.length !== 0);
//       let returnedString = "";
//       names.forEach((name, i) => {
//         if (i === names.length - 1) {
//           returnedString = `${returnedString}const ${name} = require(${path}).${name};`;
//         } else {
//           returnedString = `${returnedString}const ${name} = require(${path}).${name};\n`;
//         }
//       });
//       return returnedString;
//     } else {
//       return `const ${nameSring} = require(${path}).${nameSring};`;
//     }
//   }

//   if (
//     name &&
//     !name.match(/\{/i) &&
//     !name.match(/\}/i) &&
//     path &&
//     path.match(/\.\//i)
//   ) {
//     return `const ${name} = require(${path});`;
//   }

//   return `const ${name} = require(${path});`;
// };

// const parseString = string => {
//   const arrayedString = splitString(string);
//   if (arrayedString.length === 1) {
//     return createRequireString(arrayedString[0].trim());
//   } else {
//     const convertedStrings = arrayedString
//       .filter(line => line.length !== 0)
//       .map(line => createRequireString(line.trim()));
//     let returnedString = "";
//     convertedStrings.forEach((line, i) => {
//       if (i === arrayedString.length - 1) {
//         returnedString = `${returnedString}${line}`;
//       } else {
//         returnedString = `${returnedString}${line}\n`;
//       }
//     });
//     return returnedString;
//   }
// };

// const string = `
// import AWS from 'aws-sdk';
// import s3ls from 's3-ls';
// import moment from 'moment';
// import request from 'request';
// import Decimal from 'decimal.js';
// import randomstring from 'randomstring';
// import Nounproject from 'the-noun-project';
// import Unsplash from 'unsplash-js';
// import fetch from 'node-fetch';
// import * as models from '../../models';
// import formatUpdate from '../../../helpers/formatUpdate';
// import uppercaseFirst from '../../../helpers/uppercaseFirst';
// import sendError from '../../../helpers/sendError';
// import getRoles from '../../../helpers/getRoles';
// import cleanFromNullValues from '../../../helpers/cleanFromNullValues';

// import translateString from '../../../helpers/translation/translateString';
// import { formatToStripeAddress, formatToStripeDob } from '../../stripe/methods';
// import transferToEmployee from '../../../helpers/fees/transferToEmployee';
// import transferToEntrepreneur from '../../../helpers/fees/transferToEntrepreneur';
// import transferToPromoter from '../../../helpers/fees/transferToPromoter';
// import transferToSupplier from '../../../helpers/fees/transferToSupplier';
// import transferToFreelancer from '../../../helpers/fees/transferToFreelancer';
// import stripe from '../../stripe';
// import { getRolesArr } from '../../../helpers/server';
// import { sendMailAsync, sendMail } from '../../mail';
// import {
//   startBookupFeeCharges,
//   stopBookupFeeCharges,
//   getCronTasks,
//   startSubscriptionFeeCharges,
//   stopSubscriptionFeeCharges,
// } from '../../../helpers/scheduler';
// import bookupServices from '../../../defaults/bookupServices';
// import {
//   createContact,
//   createEntrepreneur,
// } from '../../controllers/people-creators';
// import { getPopulatedCompany } from '../../controllers/company';
// import { createCollectionIfNotExistent } from '../../../library/booking/helpers';
// `;

// parseString(string); //?
